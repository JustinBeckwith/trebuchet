import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './machines/appManager';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MyMainApp from './components/myMainApp';

const appManager = new AppManager();
injectTapEventPlugin();
ReactDOM.render(
  <MyMainApp manager={appManager} />,
  document.getElementById('app')
);
