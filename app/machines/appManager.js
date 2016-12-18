import * as AppStates from './appStates';
import DevAppWrap from './devAppWrap';
import {shell} from 'electron';

export default class AppManager {

  constructor() {
    this.apps = [];
    this.getApps().then((apps) => {
      this.apps = apps;
    });
    this.devAppWrap = new DevAppWrap();
  }

  getApps = () => {
    return new Promise((resolve, reject) => {
      resolve(data);
    });
  }
  
  browseApp = (app) => {
    shell.openExternal(`http://localhost:${app.port}`);
  }

  openSDKConsole = (app) => {
    shell.openExternal(`http://localhost:${app.adminPort}`);
  }

  openConsole = (app) => {
    shell.openExternal(`https://console.cloud.google.com/appengine?project=${app.name}`);
  }

  startApp = (app, stateNotifier) => {
    app.status = AppStates.STARTING;
    stateNotifier();
    return this.devAppWrap.startAppServer(app).then(() => {
      app.status = AppStates.STARTED;
      stateNotifier();
      return app;
    });
  }
  
  stopApp = (app, stateNotifier) => {
    app.status = AppStates.STOPPING;
    stateNotifier();
    return this.devAppWrap.stopAppServer(app).then(() => {
      app.status = AppStates.STOPPED;
      stateNotifier();
      return app;
    });
  }
}

let data = [{
  name: "shell-php",
  path: "/Users/beckwith/minishell",
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