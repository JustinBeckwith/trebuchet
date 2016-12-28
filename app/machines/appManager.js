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
import fs from 'fs';
import fixPath from 'fix-path';
import log from 'electron-log';
import chmodr from 'chmodr';

export default class AppManager extends EventEmitter {

  constructor() {
    super();
    
    // import OSX path variables so you can use gcloud
    fixPath();
    log.info("PATH: " + process.env.PATH);
    
    // allow override of the log level 
    let logLevel = _.find(process.argv, arg => arg.indexOf('--log-level=') > -1);
    if (logLevel) {
      let level = logLevel.split('=')[1];
      console.log('Setting log level to ' + level);
      log.transports.console.level = level;
      log.transports.file.level = level;
    }

    // getAppPath seems to be one ../ off when packaged vs dev. 
    this.resourcesPath = remote.app.getAppPath();
    fs.stat(path.join(this.resourcesPath, 'templates'), (err, stat) => {
      if (err) {
        this.resourcesPath = path.normalize(path.join(this.resourcesPath, '../'));
        log.info(`Resource path is ${this.resourcesPath}`);
      }
    });

    this.apps = null;
    this.getApps().then((apps) => {
      this.apps = apps;
    });

    this.logManager = new LogManager();
    this.gcloudWrap = new GCloudWrap();
    this.devAppWrap = new DevAppWrap();
    this.devAppWrap.on('close', (app) => {
      app.status = AppStates.STOPPED;
      log.info(`app ${app.path} is stopped!`);
      this.emit(AppEvents.STOPPED, app);
      this.emit(AppEvents.STATUS_CHANGED, app);
    });
  }

  /**
   *  Check which gcloud deps are installed, and cache the results
   *  so we can look it up later. Store the results in local storag
   *  just in case we need to check before the inital command completes.
   */
  checkDeps = () => {
    return this.gcloudWrap.getComponents().then(results => {
      let installedComponents = results.map((component) => {
        return {
          id: component.id,
          installed: (component.state.name === "Installed")
        }
      });
      return db.setItem('deps', installedComponents)
    }).catch(err => {
      log.error("Error checking components... ")
      log.error(err);
    });
  }

  isCloudSdkInstalled = () => {
    return this.gcloudWrap.checkInstalled();
  }

  isComponentInstalled = (component) => {
    return db.getItem('deps').then((deps) => {
      let c = _.find(deps, { id: component});
      return c && c.installed;
    });
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
    if (this._getAppsPromise) {
      return this._getAppsPromise;
    } 
    
    // attempt to load from IndexedDB
    this._getAppsPromise = db.getItem('apps').then((apps) => {
      return apps.map((app) => {
        app.status = AppStates.STOPPED;
        return app;
      });
    }).catch((err) => {
      log.error(err);
      return [];
    });

    return this._getAppsPromise;
  }

  removeApp = (app) => {
    _.remove(this.apps, item => (item.path == app.path));
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

  /**
   * Invoked when the back button on the selection bar is clicked. 
   */
  exitSelection = () => {
    this.emit(AppEvents.EXIT_SELECTION);
  }

  /**
   * Invoked when the selection of applications in the grid has changed.
   */
  selectionChanged = (selectedApps) => {
    this.emit(AppEvents.SELECTION_CHANGED, selectedApps);
  }

  /**
   * Start a given application using the appropriate emulator.
   */
  startApp = (app) => {

    // we can't run flex apps quite yet
    if (app.env == "flex") {
      this.emit(AppEvents.SHOW_ERROR, { 
        title: "Flex not supported",
        message: "Trebuchet doesn't currently support running App Engine Flex applications."
      });
      return;
    }
    
    // notify UI the start is starting
    app.status = AppStates.STARTING;
    this.emit(AppEvents.STATUS_CHANGED, app);

    // check to see if this configuration requires a component to be installed
    let component = "";
    switch (app.runtime) {
      case "python":
        component = "app-engine-python";
        break;
      case "go":
        component = "app-engine-go";
        break;
      case "php":
        component = "app-engine-php-darwin";
        break;
      case "java":
        component = "app-engine-java";
        break;
    }

    // install the component if needed, then start the app server
    this._installComponentIfNeeded(component, app).then(() => {
      
      // start the app server;
      let process = this.devAppWrap.startAppServer(app);

      // attach the logger to the app process
      return this.logManager.attachLogger(app, process).then((logger) => {
        process.stderr.on('data', (data) => {
          app.status = AppStates.STARTED;
          this.emit(AppEvents.STARTED, app);
          this.emit(AppEvents.STATUS_CHANGED, app);
        });
        this.emit(AppEvents.EMIT_LOGS, app);
      });
    })
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
        log.error('Error deploying app');
        log.error(err);
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

  /**
   * Add a new application based on a template. 
   */
  addApp = (appRequest) => {
    log.info(appRequest);
    let app = {
      name: appRequest.project,
      runtime: appRequest.runtime,
      env: appRequest.env,
      path: path.join(appRequest.path, appRequest.project),
      adminPort: appRequest.adminPort,
      port: appRequest.port,
      status: AppStates.STOPPED
    }
    this.apps.push(app);
    db.setItem('apps', this.apps);

    

    // attempt to create the app directory
    let srcDir = `${this.resourcesPath}/templates/${appRequest.runtime}/standard/basic`;
    log.info('copying template from ' + srcDir);
    fse.copy(srcDir, app.path, (err) => {
      if (err) {
        log.error("Error creating application");
        log.error(err);
      }

      // files copied from the app dir will be 644, preventing execute
      // even though it works locally! Also webpack has a bug that prevents
      // using 0755, so I'm using the decimal notation.  
      chmodr(app.path, 493, (err) => {
        if (err) {
          log.error("Error creating application");
          log.error(err);
        }
        this.emit(AppEvents.APP_CREATED, app);

        // create a new cloud project if they wanted to
        if (appRequest.autoCreate) {
          this._createCloudProject(app);
        }
      })
    });
  }

  /**
   * Import an application from a directory on disk.  
   */
  importApp = (appRequest) => {
    log.info(appRequest);
    let app = {
      name: appRequest.project,
      path: appRequest.path,
      adminPort: appRequest.adminPort,
      port: appRequest.port,
      status: AppStates.STOPPED,
      runtime: appRequest.runtime,
      env: appRequest.env,
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

  /**
   * Install a component only if not already installed. Returns
   * a promise that resolves when the installation is finished.  
   */
  _installComponentIfNeeded = (component, app) => {
    log.info('Checking for component ' + component);
    return new Promise((resolve, reject) => {
      this.isComponentInstalled(component).then(installed => {
        if (!installed) {
          log.info('Component ' + component + ' is not installed.');
          let command = this.gcloudWrap.installComponent(component)
            .on('exit', (code, signal) => {
              if (code == 0) {
                log.info('Component ' + component + " installed");
                // re-run checkdeps so the new results are cached
                this.checkDeps();
                resolve();
              } else {
                log.error('something went wrong installing a component');
                reject(code);
              }
            });
          this.logManager.attachLogger(app, command).then(() => {
            this.emit(AppEvents.EMIT_LOGS, app);
          });
        } else {
          resolve();
        }
      });
    });
  }

  _createCloudProject = (app) => {
    this.emit(AppEvents.PROJECT_CREATING, app);
    this._installComponentIfNeeded('alpha', app).then(() => {
      let p1 = this.gcloudWrap.createProject(app)
        .on('exit', (code, signal) => {
          if (code == 0) {
            let p2 = this.gcloudWrap.createApp(app)
              .on('exit', (code, signal) => {
                if (code == 0) {
                  log.info('project/app create done!');
                  this.emit(AppEvents.PROJECT_CREATED, app);
                } else {
                  log.error('error creating app ' + code);
                  this.emit(AppEvents.PROJECT_CREATE_FAILED, '');
                }
              });
            this.logManager.attachLogger(app, p2).then(() => {
              this.emit(AppEvents.EMIT_LOGS, app);
            });
          } else {
            log.error('error creating project ' + code);
            this.emit(AppEvents.PROJECT_CREATE_FAILED, '');
          }
        });
      this.logManager.attachLogger(app, p1).then(() => {
        this.emit(AppEvents.EMIT_LOGS, app);
      });
    });
  }
}