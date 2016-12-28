import React from 'react';
import AppBar from 'material-ui/AppBar';

export default class MyAppBar extends React.Component {
  render() {
    return (
      <AppBar
        title="App Engine Trebuchet"
        titleStyle={{fontSize: '18px'}}
        className="appBar"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
  }
}