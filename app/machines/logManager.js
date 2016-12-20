import os from 'os';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v4';

const tmpDirName = 'trebuchet';

export default class LogManager {

  constructor() {
    this.logMap = new Map();
  }

  /*
   * Each application will have a single text log in tmp on disk.  Various processes
   * That operate on the app will all write to the same log file.  Writing to disk keeps
   * the log out of memory, and helps prevent leaks.  
   */
  attachLogger(app, process) {
    return this.createTmpDirIfNotExists()
      .then((tmpdir) => {
        return this.createAppLogIfNotExists(tmpdir, app);
      })
      .then((writeStream) => {
        this.configureLogger(process, writeStream);
      })
      .catch((err) => {
        console.log("ERROR: " + err);
      }); 
  }

  /*
   * Given a process, attach the appropriate handlers and pipe output to 
   * the log file. 
   */
  configureLogger(process, writeStream) {
    process.stdout.setEncoding('utf8');
    process.stderr.setEncoding('utf8');
    process.stdout.pipe(writeStream);
    process.stderr.pipe(writeStream);
  }

  /*
   * Create the tmp dir if it doesn't exist. 
   */
  createTmpDirIfNotExists() {
    return new Promise((resolve, reject) => {
      let tmpDir = path.join(os.tmpdir(), tmpDirName);
      console.log('tmp dir! ' + tmpDir);
      fs.mkdir(tmpDir, (err) => {
        if (err && err.code != "EEXIST") {
          return reject(err);
        } else {
          return resolve(tmpDir);
        }
      });
    });
  }


  /*
   * Create the app log if it doesn't exist.  Returns the a writableStream
   * to a log provisioned for the given app. 
   */
  createAppLogIfNotExists(tmpDir, app) {
    return new Promise((resolve, reject) => {
      
      // check to see if we already have a log for the app
      let writeStream = this.logMap.get(app.name);
      if (writeStream) {
        return resolve(writeStream);
      } 

      // create the app log file in tmp
      let logPath = path.join(tmpDir, uuid());
      console.log('new log path! ' + logPath);
      writeStream = fs.createWriteStream(logPath)
        .on('error', (error) => {
          reject(error);
        })
      
      // make sure to update the map with the new log file
      this.logMap.set(app.name, writeStream);
      return resolve(writeStream);
    });
  }

}
