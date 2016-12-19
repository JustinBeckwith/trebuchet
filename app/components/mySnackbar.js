import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import * as AppEvents from './../machines/appEvents';

export default class mySnackbar extends React.Component {

  constructor(props) {
    super(props);

    this.snacktions = {
      RESTART: 'restart',
      VIEW_LOG: 'view log',
      OPEN: 'open',
      BROWSE: 'browse'
    }
  
    this.state = {
      message: 'Deployment complete.',
      open: false
    };
    
    let appManager = this.props.manager;
    appManager.on(AppEvents.STOPPED, (app) => {
      this.setState({ 
        message: `${app.name} stopped.`,
        open: true,
        action: this.snacktions.RESTART,
        app: app
      });
    }).on(AppEvents.DEPLOY_FAILED, (app) => {
      this.setState({ 
        message: 'Deployment failed.',
        open: true,
        action: this.snacktions.VIEW_LOG,
        app: app
      });
    }).on(AppEvents.DEPLOY_SUCCEED, (app) => {
      this.setState({ 
        message: 'Deployment complete.',
        open: true,
        action: this.snacktions.BROWSE,
        app: app
      });
    }).on(AppEvents.STARTED, (app) => {
      this.setState({ 
        message: `${app.name} started.`,
        open: true,
        action: this.snacktions.OPEN,
        app: app
      });
    });
  }

  handleTouchTap = () => {
    this.setState({
      open: true,
    });
  };

  handleActionTouchTap = () => {
    let appManager = this.props.manager;
    this.setState({
      open: false,
    });
    switch(this.state.action) {
      case this.snacktions.OPEN:
        appManager.browseApp(this.state.app);
        break;
      case this.snacktions.BROWSE:
        appManager.browseProdApp(this.state.app);
        break;
      case this.snacktions.RESTART:
        appManager.startApp(this.state.app);
        break;
      case this.snacktions.VIEW_LOG:
        appManager.browseApp(this.state.app);
        break;
    }
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