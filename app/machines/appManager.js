import * as AppStates from './appStates';
import DevAppWrap from './devAppWrap';
import GCloudWrap from './gcloudWrap';
import {shell, remote} from 'electron';
import EventEmitter from 'events';
import _ from 'lodash';
import * as AppEvents from './appEvents';
import LogManager from './logManager';
import path from 'path';
import db from 'localforage';
import fse from 'fs-extra';

export default class AppManager extends EventEmitter {

  constructor() {
    super();
    this.apps = null;
    this.getApps().then((apps) => {
      this.apps = apps;
    });

    this.logManager = new LogManager();
    this.gcloudWrap = new GCloudWrap();
    this.devAppWrap = new DevAppWrap();
    this.devAppWrap.on('close', (app) => {
      app.status = AppStates.STOPPED;
      console.log(`app ${app.path} is stopped!`);
      this.emit(AppEvents.STOPPED, app);
      this.emit(AppEvents.STATUS_CHANGED, app);
    });
  }

  isCloudSdkInstalled = () => {
    return this.gcloudWrap.checkInstalled();
  }

  isUserLoggedIn = () => {
    return this.gcloudWrap.checkUserLoggedIn();
  }

  attemptUserLogin = () => {
    return this.gcloudWrap.attemptLogin();
  }

  getApp = (name) => {
    return this.getApps().then((apps) => {
      let app = _.find(apps, { name: name });
      return app;
    });
  }

  getApps = () => {
    // return from local memory after initial load
    if (this.apps) {
      return new Promise((resolve, reject) =>  resolve(this.apps));
    } 
    
    // attempt to load from IndexedDB
    return db.getItem('apps').then((apps) => {
      return apps.map((app) => {
        app.status = AppStates.STOPPED;
        return app;
      });
    }).catch((err) => {
      console.log(err);
      return [];
    });
  }

  removeApp = (app) => {
    this.apps = _.remove(this.apps, (item) => {
      return item.path != app.path;
    });
    db.setItem('apps', this.apps);
    this.emit(AppEvents.REMOVED, app);
  }
  
  browseApp = (app) => {
    shell.openExternal(`http://localhost:${app.port}`);
  }

  browseProdApp = (app) => {
    shell.openExternal(`https://${app.name}.appspot.com`);
  }

  openSDKConsole = (app) => {
    shell.openExternal(`http://localhost:${app.adminPort}`);
  }

  openConsole = (app) => {
    shell.openExternal(`https://console.cloud.google.com/appengine?project=${app.name}`);
  }

  viewLogs = (app) => {
    this.emit(AppEvents.VIEW_LOGS, app);
  }

  startApp = (app) => {
    app.status = AppStates.STARTING;
    this.emit(AppEvents.STATUS_CHANGED, app);
    let process = this.devAppWrap.startAppServer(app);
    return this.logManager.attachLogger(app, process).then((logger) => {
      this.emit(AppEvents.EMIT_LOGS, app);
      process.on('data', (data) => {
        app.status = AppStates.STARTED;
        this.emit(AppEvents.STARTED, app);
        this.emit(AppEvents.STATUS_CHANGED, app);
        return app;
      });
    });
  }
  
  stopApp = (app) => {
    app.status = AppStates.STOPPING;
    this.emit(AppEvents.STATUS_CHANGED, app);
    return this.devAppWrap.stopAppServer(app).then(() => {
      app.status = AppStates.STOPPED;
      this.emit(AppEvents.STOPPED, app);
      this.emit(AppEvents.STATUS_CHANGED, app);
      return app;
    });
  }

  deployApp = (app) => {
    let prevStatus = app.status;
    app.status = AppStates.DEPLOYING;
    this.emit(AppEvents.STATUS_CHANGED, app);
    let command = this.gcloudWrap.deployApp(app)
      .on('error', (err) => {
        console.log('some kind of error: ' + err);
        app.status = prevStatus;
        this.emit(AppEvents.DEPLOY_FAILED, app);
        this.emit(AppEvents.STATUS_CHANGED, app);
      })
      .on('exit', (code, signal) => {
        app.status = prevStatus;
        if (code == 0) {
          this.emit(AppEvents.DEPLOY_SUCCEED, app);  
        } else {
          this.emit(AppEvents.DEPLOY_FAILED, app);
        }
        this.emit(AppEvents.STATUS_CHANGED, app);
      });
    this.logManager.attachLogger(app, command);
    this.emit(AppEvents.EMIT_LOGS, app);
  }

  getAppLog = (app) => {
    return this.logManager.getAppLog(app);
  }

  newApp = () => {
    this.emit(AppEvents.NEW_APP);
  }

  addApp = (appRequest) => {
    console.log(appRequest);
    let app = {
      name: appRequest.project,
      path: path.join(appRequest.path, appRequest.project),
      adminPort: appRequest.adminPort,
      port: appRequest.port,
      status: AppStates.STOPPED
    }
    this.apps.push(app);
    db.setItem('apps', this.apps);

    // attempt to create the app directory
    console.log(remote.app.getAppPath());
    let srcDir = `${remote.app.getAppPath()}/templates/${appRequest.runtime}/standard/basic`;
    fse.copy(srcDir, app.path, (err) => {
      this.emit(AppEvents.APP_CREATED, app);
    });

    // create a new cloud project if they wanted to
    if (appRequest.autoCreate) {
      this._createCloudProject(app);
    }
  }

  importApp = (appRequest) => {
    console.log(appRequest);
    let app = {
      name: appRequest.project,
      path: appRequest.path,
      adminPort: appRequest.adminPort,
      port: appRequest.port,
      status: AppStates.STOPPED
    }
    this.apps.push(app);
    db.setItem('apps', this.apps);
    this.emit(AppEvents.APP_CREATED, app);

    // create a new cloud project if they wanted to
    if (appRequest.cloudSettings == "newCloudProject") {
      this._createCloudProject(app);
    }
  }

  showImportApp = () => {
    this.emit(AppEvents.SHOW_IMPORT_APP);
  }

  _createCloudProject = (app) => {
    this.emit(AppEvents.PROJECT_CREATING, app);
    let p1 = this.gcloudWrap.createProject(app)
      .on('exit', (code, signal) => {
        if (code == 0) {
          let p2 = this.gcloudWrap.createApp(app)
            .on('exit', (code, signal) => {
              if (code == 0) {
                console.log('project/app create done!');
                this.emit(AppEvents.PROJECT_CREATED, app);
              } else {
                console.log('error creating app ' + code);
                this.emit(AppEvents.PROJECT_CREATE_FAILED, '');
              }
            });
          this.logManager.attachLogger(app, p2).then(() => {
            this.emit(AppEvents.EMIT_LOGS, app);
          });
        } else {
          console.log('error creating project ' + code);
          this.emit(AppEvents.PROJECT_CREATE_FAILED, '');
        }
      });
    this.logManager.attachLogger(app, p1).then(() => {
      this.emit(AppEvents.EMIT_LOGS, app);
    });
  }
}