import {shell} from 'electron';

export const ADD_APP = 'ADD_APP';
export const START_APP = 'START_APP';
export const STOP_APP = 'STOP_APP';
export const OPEN_SDK_CONSOLE = 'OPEN_SDK_CONSOLE';
export const BROWSE = 'BROWSE';
export const REQUEST_APPS = 'REQUEST_APPS';
export const RECEIVE_APPS = 'RECEIVE_APPS';

let data = [{
      name: "shell-php",
      path: "~/minishell",
      adminPort: 8003,
      status: "started",
      port: 11080
    }, {
      name: "boo",
      path: "/some/path/12345",
      adminPort: 9876,
      status: "stopped",
      port: 890
    }, {
      name: "moo",
      path: "/some/person/45",
      adminPort: 194,
      status: "starting",
      port: 235
    }, {
      name: "doo",
      path: "/some/path/1dddd5",
      adminPort: 3456,
      status: "stopping",
      port: 44
}];

function requestApps() {
  return {
    type: REQUEST_APPS
  }
}

function receiveApps(apps) {
  return {
    type: RECEIVE_APPS,
    apps: apps
  }
}

function fetchApps() {
  return dispatch => {
    dispatch(requestApps());

    let p = new Promise((resolve, reject) => {
      resolve(data);
    }).then((apps) => {
      dispatch(receiveApps(apps));
    });
  }
}

function shouldFetchApps(state) {
  const apps = state.apps;
  if (!apps || apps.length == 0) {
    return true;
  } else if (apps.isFetching) {
    return false;
  } else {
    return true;
  }
}

export function fetchAppsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchApps(getState())) {
      return dispatch(fetchApps())
    }
  }
}

export const addApp = (app) => {
  return {
    type: ADD_APP,
    app
  }
}

export const startApp = (app) => {
  return {
    type: START_APP,
    app
  }
}

export const stopApp = (app) => {
  return {
    type: STOP_APP,
    app
  }
}

export const browseApp = (port) => {
  shell.openExternal(`http://localhost:${port}`);
}

export const openSDKConsole = (adminPort) => {
  shell.openExternal(`http://localhost:${adminPort}`);
}

export const openConsole = (name) => {
  shell.openExternal(`https://console.cloud.google.com/appengine?project=${name}`);
}