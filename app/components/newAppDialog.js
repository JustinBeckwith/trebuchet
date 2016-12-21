import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as AppEvents from './../machines/appEvents';
import {remote} from 'electron';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FileUpload from 'material-ui/svg-icons/file/file-upload';
import generate from 'project-name-generator';
import os from 'os';
import path from 'path';

export default class newAppDialog extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false
    }

    let manager = this.props.manager;
    manager.on(AppEvents.NEW_APP, () => {
      this.getNextPort().then((port) => {
        let name = generate({ number: true }).dashed;
        let localPath = path.join(os.homedir(), "appengine", name);
        this.setState({
          open: true,
          project: name,
          port: port,
          adminPort: port+1,
          path: localPath,
          runtime: "python27",
        });
      });
    });
  
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  onProjectChange = (event) => {
    this.setState({
      project: event.target.value,
    }, () => {
      if (!this.state.pathModified) {
        this.setState({
          path: path.join(os.homedir(), "appengine", this.state.project)
        });
      }
    });
  }

  onPortChange = (event) => {
    this.setState({
      port: event.target.value,
    });
  }

  onAdminPortChange = (event) => {
    this.setState({
      adminPort: event.target.value,
    });
  }

  onRuntimeChange = (event) => {
    this.setState({
      runtime: event.target.value,
    });
  }

  onUploadClick = () => {
    let result = remote.dialog.showOpenDialog({properties: ['openDirectory']});
    console.log(result);
    this.setState({
      path: result,
      pathModified: true,
    });
  }

  getNextPort = () => {
    return this.props.manager.getApps().then((apps) => {
      // find the highest port available in the 8xxx range
      let max = 8000;
      for (let app of apps) {
        if (app.port > max) max = app.port;
        if (app.adminPort > max) max = app.adminPort;
      }
      return (max+1);
    });
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <Dialog
        title="New application"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}>

        <div>
          <TextField 
            hintText="Project" 
            value={this.state.project}
            onChange={this.onProjectChange} />
        </div>
        <div>
          <TextField 
            hintText="Application directory" 
            value={this.state.path}
            onChange={this.onPathChange}
            disabled={true} />
          <FloatingActionButton 
            mini={true} 
            secondary={true}
            onClick={this.onUploadClick}>
            <FileUpload />
          </FloatingActionButton>
        </div>
        <div>
          <SelectField 
            value={this.state.runtime}
            onChange={this.onRuntimeChange}>
            <MenuItem value="python27" primaryText="Python 2.7" key="python27" />
            <MenuItem value="PHP" primaryText="PHP" key="PHP" />
          </SelectField>
        </div>
        <div>
          <TextField 
            hintText="Port" 
            value={this.state.port}
            onChange={this.onPortChange} />
        </div>
        <div>
          <TextField 
            hintText="Admin Port"
            value={this.state.adminPort}
            onChange={this.onAdminPortChange} />
        </div>
      </Dialog>
    );
  }
}