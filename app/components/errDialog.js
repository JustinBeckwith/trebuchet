import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {remote, shell} from 'electron';
import * as AppEvents from './../machines/appEvents';

export default class errDialog extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      title: "",
      message: "",
    };

    let manager = this.props.manager;
    manager.on(AppEvents.SHOW_ERROR, (err) => {
      let title = err.title ? err.title : "Oops.";
      let message = err.message ? err.message : err;
      this.setState({
        open: true,
        title: title,
        message: message,
      });
    }); 
  }
  
  handleClose = () => {
    this.setState({
      open: false,
    });
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

    return (
      <Dialog title={this.state.title}
        actions={actions}
        modal={true}
        open={this.state.open}
        onRequestClose={this.handleClose}>
        {this.state.message}
      </Dialog>
    );
  }
}