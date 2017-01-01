import {exec} from 'child_process';
import spawn from 'cross-spawn';
import log from 'electron-log';
import uac from './../uac/uac';

export default class gcloudWrap {

  checkInstalled = () => {
    return new Promise((resolve, reject) => {
      let command = spawn('gcloud', ['-v'])
        .on('error', (err) => {
          log.error('Error running gcloud -v');
          log.error(err);
          resolve(false);
        })
        .on('exit', (code, signal) => {
          if (code != 0) {
            log.error('Error running gcloud -v');
            log.error(code + " : " + signal);
          }
          resolve(code == 0);
        });
      
      command.stdout.setEncoding('utf8');
      command.stderr.setEncoding('utf8');
      command.stderr.on('data', (data) => {
        log.debug(data);
      });
      command.stdout.on('data', (data) => {
        log.debug(data);
      });
    });
  }

  checkUserLoggedIn = () => {
    return new Promise((resolve, reject) => {
      exec('gcloud auth list --format json', (err, stdout, stderr) => {
        if (err) {
          return resolve(false);
        } else if (stdout) {
          let results = JSON.parse(stdout);
          let loggedIn = (results.length > 0);
          return resolve(loggedIn);
        } else {
          return resolve(false);
        }
      });
    });
  }

  attemptLogin = () => {
    return new Promise((resolve, reject) => {
      exec('gcloud auth login', (err, stdout, stderr) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  runAppCommand = (app, params) => {
    
    return new Promise((resolve, reject) => {
      let options = app ? { 
          cwd: app.path,
        } : {};
      
      log.info('Running gcloud command in ' + options.cwd);
      log.info(params);

      let command = spawn('gcloud', params, options)
        .on('close', (code) => {
          log.info(`child process exited with code ${code}`);
        }).on('error', (err) => {
          log.error(`child process exited with err`);
          log.error(err);
        }).on('exit', (code, signal) => {
          log.info(`child process exited with code ${code} and signal ${signal}`);
        });
        
      command.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      command.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      resolve(command);
    });
  }

  runWinAppCommand = (app, params) => {
    
    let options = app ? { 
        cwd: app.path,
      } : {};
    
    log.info('Running gcloud command in ' + options.cwd);
    log.info(params);

    return sudoer.spawn('gcloud', params, options).then((cp) => {
      cp.on('close', (code) => {
        log.info(`child process exited with code ${code}`);
      }).on('error', (err) => {
        log.error(`child process exited with err`);
        log.error(err);
      }).on('exit', (code, signal) => {
        log.info(`child process exited with code ${code} and signal ${signal}`);
      });
      
      cp.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
      
      cp.stderr.on('data', (data) => {
        console.log(`stderr: ${data}`);
      });

      return cp;
    });
  }

  deployApp = (app) => {
    return this.runAppCommand(app, 
      ['app', 'deploy', 'app.yaml', '-q', '--project', app.name]);
  }

  createProject = (app) => {
    return this.runAppCommand(app, 
      ['alpha', 'projects', 'create', app.name]);
  }

  /**
   * Install a component for the gcloud tool.  On Windows, this requires
   * elevation, so use the electron-sudo module.
   */
  installComponent = (component) => {
    if (/^win/.test(process.platform)) {      
      return uac.installComponent(component);
    } else {
      return this.runAppCommand(null,
        ['components', 'install', component, '-q']);
    }
  }

  createApp = (app) => {
    return this.runAppCommand(app, 
      ['app', 'create', '--region', 'us-central', '--project', app.name]);
  }

  getComponents = () => {
    return new Promise((resolve, reject) => {
      exec('gcloud components list --format json', (err, stdout, stderr) => {
        if (err) {
          reject(err);
        } else {
          let output = JSON.parse(stdout);
          resolve(output);
        }
      }); 
    });
  }

}