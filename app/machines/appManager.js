import * as AppStates from './appStates';
import DevAppWrap from './devAppWrap';
import GCloudWrap from './gcloudWrap';
import {shell} from 'electron';
import EventEmitter from 'events';
const _ = require('lodash');
import * as AppEvents from './appEvents';

export default class AppManager extends EventEmitter {

  constructor() {
    super();
    this.apps = [];
    this.getApps().then((apps) => {
      this.apps = apps;
    });

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

  getApps = () => {
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }

  removeApp = (app) => {
    this.apps = _.remove(this.apps, (item) => {
      return item.path === app.path;
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
    let server = this.devAppWrap.startAppServer(app);
    server.stdout.setEncoding('utf8');
    server.stderr.setEncoding('utf8');
    server.stdout.on('data', (data) => {
      this.emit(AppEvents.EMIT_LOGS, { app: app, data: data });
    });
    server.stderr.on('data', (data) => {
      this.emit(AppEvents.EMIT_LOGS, { app: app, data: data });
    });

    app.status = AppStates.STARTED;
    this.emit(AppEvents.STARTED, app);
    this.emit(AppEvents.STATUS_CHANGED, app);
    return app;
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
    command.stdout.setEncoding('utf8');
    command.stderr.setEncoding('utf8');
    command.stdout.on('data', (data) => {
      this.emit(AppEvents.EMIT_LOGS, { app: app, data: data });
    });
    command.stderr.on('data', (data) => {
      this.emit(AppEvents.EMIT_LOGS, { app: app, data: data });
    });
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