const spawn = require('child_process').spawn;

export default class gcloudWrap {

  checkInstalled = () => {
    return new Promise((resolve, reject) => {
      let command = spawn('gcloud', ['-v'])
        .on('exit', (code, signal) => {
          resolve(code == 0); 
        });
    });
  }

  deployApp = (app) => {
    let command = spawn('gcloud', [
      'app', 'deploy', 'app.yaml', '-q', '--project', app.name
      ], { 
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
}