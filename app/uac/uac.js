import path from 'path';
import os from 'os';
import {spawn} from 'child_process';
import log from 'electron-log';
import {remote} from 'electron';

exports.installComponent = (component) => {
  return new Promise((resolve, reject) => {
    let options = { shell: true };
    let uacDir = path.join(remote.app.getAppPath(), path.normalize('app/uac'));
    let elevatePath = path.join(uacDir, 'elevate-' + os.arch() + '.exe');
    let batchPath = path.join(uacDir, "installComponent.bat");

    // The Cloud SDK can't seem to run -q commands in cmd without running
    // this prep command first. 
    let cmdArgs = ["-w", batchPath, component];
    
    let command = spawn(elevatePath, cmdArgs, options)
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

    return resolve(command);
  });
}