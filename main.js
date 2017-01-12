const electron = require('electron');
const path = require('path');
const url = require('url');
const updater = require('./appUpdater');
const log = require('./logger');

log.info('Starting up the trebuchet!');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024, 
    height: 768,
    icon: path.join(__dirname, 'app/images/png/64x64.png'),
    backgroundColor: '#333',
  });
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'app/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  });

  // create the App Updater
  log.info('About to check for updates ...');
  updater.checkForUpdates(mainWindow);
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
