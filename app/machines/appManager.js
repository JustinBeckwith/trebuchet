import * as AppStates from './appStates';
import DevAppWrap from './devAppWrap';
import GCloudWrap from './gcloudWrap';
import {shell} from 'electron';
import EventEmitter from 'events';
const _ = require('lodash');
import * as AppEvents from './appEvents';
import LogManager from './logManager';
import path from 'path';

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

  getApp = (name) => {
    return this.getApps().then((apps) => {
      let app = _.find(apps, { name: name });
      return app;
    });
  }

  getApps = () => {
    return new Promise((resolve, reject) => {
      if (this.apps) {
        resolve(this.apps);
      } else {
        resolve(data);
      }
    });
  }

  removeApp = (app) => {
    this.apps = _.remove(this.apps, (item) => {
      return item.path != app.path;
    });
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
      app.status = AppStates.STARTED;
      this.emit(AppEvents.STARTED, app);
      this.emit(AppEvents.STATUS_CHANGED, app);
      return app;
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
    this.emit(AppEvents.APP_CREATED, app);
  }

  importApp = () => {
    this.emit(AppEvents.IMPORT_APP);
  }
}

let data = [{
  name: "shell-php",
  path: "/Users/beckwith/minishell/doesntexist",
  adminPort: 8003,
  status: "stopped",
  port: 11080
}, {
  name: "guestbook",
  path: "/Users/beckwith/guestbook",
  adminPort: 8006,
  status: "stopped",
  port: 1480
}, {
  name: "gcloud-appcfg",
  path: "/Users/beckwith/Code/demoapps/php/metrics",
  adminPort: 16080,
  status: "stopped",
  port: 8008
}];