const spawn = require('child_process').spawn;
const _ = require('lodash');
import * as AppStates from './appStates';
import EventEmitter from 'events';

export default class devAppWrap extends EventEmitter {

  constructor() {
    super();
    this.appServers = [];
  }

  startAppServer = (app) => {
    
    let server = spawn('dev_appserver.py', [
      '.',
      '--skip_sdk_update_check=yes', 
      '--port=' + app.port,
      '--admin_port=' + app.adminPort], 
      { 
        cwd: app.path
      }).on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        this.emit('close', app);
      }).on('error', (err) => {
        console.log(`child process exited with err`);
        this.emit('close', app);
      }).on('exit', (code, signal) => {
        console.log(`child process exited with code ${code} and signal ${signal}`);
        this.emit('close', app);
      });
    
    this.appServers.push({
      app: app,
      server: server
    });

    return server;
  }

  stopAppServer = (app) => {
    console.log('stopping app server...');
    return new Promise((resolve, reject) => {
      this.appServers.forEach((item) => {
        if (item.app.path === app.path) {
          if (item.server) {
            item.server.kill();
            resolve();
          }
        }
      });
    });
  }

}