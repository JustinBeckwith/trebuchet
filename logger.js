const log = require('electron-log');
const _ = require('lodash');

let logLevel = _.find(process.argv, arg => arg.indexOf('--log-level=') > -1);
if (logLevel) {
  let level = logLevel.split('=')[1];
  console.log('Setting log level to ' + level);
  log.transports.console.level = level;
  log.transports.file.level = level;
}

module.exports = log;