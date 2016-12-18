const spawn = require('child_process').spawn;

export default class gcloudWrap {

  deployApp = (app) => {
    let command = spawn('gcloud', [
      'app',
      'deploy',
      '--project ' + app.name], 
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
      
    command.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    
    command.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });

    return command;
  }
}