import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {remote, shell} from 'electron';

export default class myCloudSdkDialog extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      messageType: "install",
    };

    let manager = this.props.manager;
    manager.isCloudSdkInstalled().then((installed) => {
      if (!installed) {
        this.setState({
          open: true,
          messsageType: "install",
        });
      } else {
        manager.checkDeps();
        manager.isUserLoggedIn().then((loggedIn) => {
          if (!loggedIn) {
            this.setState({
              open: true,
              messageType: "login",
            });
            manager.attemptUserLogin().then((result) => {
              if (result) {
                this.setState({
                  open: false,
                });
              }
            });
          }
        });
      }
    });

    
  }
  
  handleClose = () => {
    remote.app.quit();
  };

  linkClick = (e) => {
    e.preventDefault();
    shell.openExternal('https://cloud.google.com/sdk/');
  };

  render() {
    const actions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.handleClose}
        keyboardFocused={true}
      />
    ];

    let dialog = <div></div>;
    switch(this.state.messageType) {
      case "install":
        dialog = (
          <Dialog title="Install the Google Cloud SDK"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}>
            The App Engine Trebuchet requires the Google Cloud SDK.  Visit <a href='#' onClick={this.linkClick}>https://cloud.google.com/sdk/</a> to get started, and then restart the application.
          </Dialog>
        );
        break;
      case "login":
        dialog = (
          <Dialog title="Log into Google Cloud"
            actions={actions}
            modal={true}
            open={this.state.open}
            onRequestClose={this.handleClose}>
            To continue, please log into your Google account.  
          </Dialog>
        );
        break;
    }
    return dialog;
  }
}