import _ from 'lodash';
import * as AppStates from './appStates';
import EventEmitter from 'events';
import log from 'electron-log';
import spawn from 'cross-spawn';

export default class devAppWrap extends EventEmitter {

  constructor() {
    super();
    this.appServers = [];
  }

  startAppServer = (app) => {
    
    /**
     * This uses the cross-spawn npm module to work around issues with spawn not
     * preserving path on Windows.  
     * https://github.com/nodejs/node-v0.x-archive/issues/2318
     */
    let server = spawn('dev_appserver.py', [
      '.',
      '--skip_sdk_update_check=yes', 
      '--port=' + app.port,
      '--admin_port=' + app.adminPort], 
      { 
        cwd: app.path
      }).on('close', (code) => {
        log.info(`child process exited with code ${code}`);
        this.emit('close', app);
      }).on('error', (err) => {
        log.error(`child process exited with err`);
        this.emit('close', app);
      }).on('exit', (code, signal) => {
        log.info(`child process exited with code ${code} and signal ${signal}`);
        this.emit('close', app);
      });
    
    this.appServers.push({
      app: app,
      server: server
    });

    return server;
  }

  /**
   * Stop an instance of an app server, or just return if there isn't
   * one available matching the app name.  
   */
  stopAppServer = (app) => {
    log.info('stopping app server...');
    return new Promise((resolve, reject) => {
      for (let item of this.appServers) {
        console.log(item);
        if (item.app.path === app.path) {
          if (item.server) {
            item.server.kill();
            resolve();
          }
        }
      }
      resolve();
    });
  }

}