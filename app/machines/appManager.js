import * as AppStates from './appStates';

export default class AppManager {

  constructor() {
    this.apps = [];
    this.getApps().then((apps) => {
      this.apps = apps;
    })
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
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        app.status = AppStates.STARTED;
        stateNotifier();
        resolve(app);
      }, 1000);
    });
  }
  
  stopApp = (app, stateNotifier) => {
    app.status = AppStates.STOPPING;
    stateNotifier();
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        app.status = AppStates.STOPPED;
        stateNotifier();
        resolve(app);
      }, 1000);
    });
  }

}

let data = [{
  name: "shell-php",
  path: "~/minishell",
  adminPort: 8003,
  status: "started",
  port: 11080
}, {
  name: "boo",
  path: "/some/path/12345",
  adminPort: 9876,
  status: "stopped",
  port: 890
}, {
  name: "moo",
  path: "/some/person/45",
  adminPort: 194,
  status: "starting",
  port: 235
}, {
  name: "doo",
  path: "/some/path/1dddd5",
  adminPort: 3456,
  status: "stopping",
  port: 44
}];