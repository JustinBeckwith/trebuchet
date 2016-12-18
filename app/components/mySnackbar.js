import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as AppEvents from './../machines/appEvents';

export default class mySnackbar extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      message: 'Deployment complete.',
      open: false
    };
    
    let appManager = this.props.manager;
    appManager.on(AppEvents.STOPPED, (app) => {
      this.setState({ 
        message: `${app.name} stopped.`,
        open: true,
        state: "restart"
      });
    }).on(AppEvents.DEPLOY_FAILED, (app) => {
      this.setState({ 
        message: 'Deployment failed.',
        open: true,
        state: "view log"
      });
    }).on(AppEvents.DEPLOY_SUCCEED, (app) => {
      this.setState({ 
        message: 'Deployment complete.',
        open: true,
        state: "open"
      });
    }).on(AppEvents.STARTED, (app) => {
      this.setState({ 
        message: `${app.name} started.`,
        open: true,
        state: "open"
      });
    });
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  };

  handleActionTouchTap = () => {
    this.setState({
      open: false,
    });
    // do work
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.state.message}
        action={this.state.action}
        onActionTouchTap={this.handleActionTouchTap}
        onRequestClose={this.handleRequestClose}
      />
    );
  }
}