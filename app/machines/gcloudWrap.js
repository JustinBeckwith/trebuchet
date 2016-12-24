import {spawn, exec} from 'child_process';

export default class gcloudWrap {

  checkInstalled = () => {
    return new Promise((resolve, reject) => {
      let command = spawn('gcloud', ['-v'])
        .on('error', (err) => {
          resolve(false);
        })
        .on('exit', (code, signal) => {
          resolve(code == 0);  
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
    let command = spawn('gcloud', params, { 
        cwd: app.path
      }).on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      }).on('error', (err) => {
        console.log(`child process exited with err`);
      }).on('exit', (code, signal) => {
        console.log(`child process exited with code ${code} and signal ${signal}`);
      });
      
    command.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    command.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    return command;
  }

  deployApp = (app) => {
    return this.runAppCommand(app, 
      ['app', 'deploy', 'app.yaml', '-q', '--project', app.name]);
  }

  createProject = (app) => {
    return this.runAppCommand(app, 
      ['alpha', 'projects', 'create', app.name]);
  }

  createApp = (app) => {
    return this.runAppCommand(app, 
      ['app', 'create', '--region', 'us-central', '--project', app.name]);
  }

}