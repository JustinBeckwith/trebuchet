const spawn = require('child_process').spawn;
const _ = require('lodash');

export default class devAppWrap {

  constructor() {
    this.appServers = [];
  }

  startAppServer = (app) => {
    
    return new Promise((resolve, reject) => {

      let server = spawn('dev_appserver.py', [
        '.',
        '--skip_sdk_update_check=yes', 
        '--port=' + app.port,
        '--admin_port=' + app.adminPort], 
        { 
          cwd: app.path
        }).on('close', (code) => {
          console.log(`child process exited with code ${code}`);
        });
        
      server.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      })
      
      server.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      this.appServers.push({
        app: app,
        server: server
      });

     
      resolve(server);
    });

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