import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './machines/appManager';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MyMainApp from './components/myMainApp';
import process from 'process';
import log from 'electron-log';

const appManager = new AppManager();
injectTapEventPlugin();
process.on('uncaughtException', err => log.error(err));
window.onerror = (messageOrEvent, source, lineno, colno, error) => { log.error(error); }

ReactDOM.render(
  <MyMainApp manager={appManager} />,
  document.getElementById('app')
);
