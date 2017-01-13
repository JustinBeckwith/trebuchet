const electron = require('electron');
const os = require('os');
const autoUpdater = electron.autoUpdater;
const log = require('electron-log');
const isDev = require('electron-is-dev');

const UPDATE_SERVER_HOST = "trebuchet-test.appspot-preview.com"

function checkForUpdates(window) {
  log.info('checking for updates!');
  let app = electron.app;
  let BrowserWindow = electron.BrowserWindow;
  let ipcMain = electron.ipcMain;

  let platform = os.platform();
  if (isDev) {
    log.info('in local dev mode');
    return;
  } else {
    log.info('in remote mode');
  }
  if (platform === "linux") return;

  const version = app.getVersion();
  
  autoUpdater.addListener("update-available", (event) => {
    log.info("A new update is available!");
  });
  
  autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName, releaseDate, updateURL) => {
    let windows = BrowserWindow.getAllWindows();
    if (windows.length == 0) {
      return;
    }
    
    log.info("An update is available.");
    log.info("%s\n%s\n%s\n%s", releaseNotes, releaseName, releaseDate, updateURL);

    // send a message to the main window, asking the user if they want to install the update
    windows[0].webContents.send("updateAvailable", {
      releaseName,
      releaseDate,
      releaseNotes
    });
    return true;
  });

  // raised when the renderer process tells us to install the update
  electron.ipcMain.on('installUpdate', (event) => {
    log.info("Installing update and quitting.");
    autoUpdater.quitAndInstall();
  });

  autoUpdater.addListener("error", (err) => {
    log.error(err);
  });

  autoUpdater.addListener("checking-for-update", (event) => {
    log.info("checking-for-update");
  });

  autoUpdater.addListener("update-not-available", () => {
    log.info("update-not-available");
  });

  if (platform === "darwin") {
    let url = `https://${UPDATE_SERVER_HOST}/update/${platform}_${os.arch()}/${version}`
    console.log(url);
    autoUpdater.setFeedURL(url)
  }

  window.webContents.once("did-frame-finish-load", (event) => {
    log.info('checking for updates ...');
    autoUpdater.checkForUpdates();
  });
}

module.exports = {
  checkForUpdates: checkForUpdates
}