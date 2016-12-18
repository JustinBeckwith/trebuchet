import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAppBar from './myAppBar';
import MyGrid from './myGrid';
import MyToolbar from './myToolbar';

export default class MyMainApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <MyAppBar />
          <MyToolbar />
          <MyGrid manager={this.props.manager} />
        </div>
      </MuiThemeProvider>
    );
  }
}