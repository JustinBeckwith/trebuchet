import os from 'os';
import path from 'path';
import fs from 'fs';
import uuid from 'uuid/v4';
//import {Tail} from 'tail';
import Tail from 'always-tail';

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
      .then((logEntry) => {
        this.configureLogger(process, logEntry.writeStream);
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
    process.stdout.pipe(writeStream, { end: false });
    process.stderr.pipe(writeStream, { end: false });
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
      let logEntry = this.logMap.get(app.name);
      if (logEntry) {
        console.log('App log already exists, returning ' + logEntry.logPath);
        return resolve(logEntry);
      } 

      // create the app log file in tmp
      let logPath = path.join(tmpDir, uuid());
      console.log('new log path! ' + logPath);
      let writeStream = fs.createWriteStream(logPath)
        .on('error', (error) => {
          reject(error);
        })
      
      // make sure to update the map with the new log file
      logEntry = { 
        logPath: logPath,
        writeStream: writeStream
      };
      this.logMap.set(app.name, logEntry);
      return resolve(logEntry);
    });
  }

  getAppLog(app) {
    let logEntry = this.logMap.get(app.name);
    if (logEntry) {
      // detach the old watcher first
      if (logEntry.tail) {
        logEntry.tail.unwatch();
      }
      let tail = new Tail(logEntry.logPath, '\n', { start: 0 })
        .on('line', (data) => {
          console.log(data);
        })
        .on("error", (err) => {
          console.log('ERROR: ', error);
        });
        
      this.logMap.set(app.name, Object.assign(logEntry, { tail: tail }));
      return tail;
    } 
    return null;
  }

}
