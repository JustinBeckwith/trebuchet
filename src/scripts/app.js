import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAppBar from './myAppBar';
import MyGrid from './myGrid';
import MyToolbar from './myToolbar';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();
 
const App = () => (
  <MuiThemeProvider>
    <div>
      <MyAppBar />
      <MyToolbar />
      <MyGrid />
    </div>
  </MuiThemeProvider>
);
 
ReactDOM.render(
  <App />,
  document.getElementById('app')
);
