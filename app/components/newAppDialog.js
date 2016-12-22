import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import * as AppEvents from './../machines/appEvents';
import {remote} from 'electron';
import CloudDone from 'material-ui/svg-icons/file/cloud-done';
import CloudOff from 'material-ui/svg-icons/file/cloud-off';
import generate from 'project-name-generator';
import os from 'os';
import path from 'path';
import fs from 'fs';

export default class newAppDialog extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
    }
    
    let localPath = path.join(os.homedir(), "AppEngineApps");
    fs.mkdir(localPath, err => {});
    
    let manager = this.props.manager;
    manager.on(AppEvents.NEW_APP, () => {
      this.getNextPort().then((port) => {
        let name = generate({ number: true }).dashed;
        let localPath = path.join(os.homedir(), "AppEngineApps");
        this.setState({
          open: true,
          project: name,
          port: port,
          adminPort: port+1,
          path: localPath,
          runtime: "python",
          autoCreate: true
        });
      });
    });    

    this.runtimes = [
      { key: 'python', label: 'Python'},
      { key: 'java', label: 'Java'},
      { key: 'go', label: 'Go'},
      { key: 'php', label: 'PHP'}
    ];
  
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
          path: path.join(os.homedir(), "AppEngineApps")
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

  onRuntimeChange = (event, key, value) => {
    this.setState({
      runtime: value,
    });
  }

  onUploadClick = () => {
    let result = remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: this.state.path
    });
    if (result && result.length > 0) {
      this.setState({
        path: result[0],
        pathModified: true,
      });
    }
  }

  onAutoCreateCheck = (event, isInputChecked) => {
    this.setState({
      autoCreate: isInputChecked,
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

    const runtimes = this.runtimes.map((runtime) => {
      return <MenuItem value={runtime.key} primaryText={runtime.label} key={runtime.key} />
    });

    return (
      <Dialog
        title="New application"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}>

        <div style={{width: '250px', float: 'left'}}>
          <div>
            <TextField 
              fullWidth={true}
              hintText="Project" 
              floatingLabelText="Project name"
              value={this.state.project}
              onChange={this.onProjectChange} />
          </div>
          <div>
            <SelectField 
              style={{width:'100px'}}
              floatingLabelText="Language"
              value={this.state.runtime}
              onChange={this.onRuntimeChange}>
              {runtimes}
            </SelectField>
          </div>
          <div>
            <TextField 
              style={{width:'100px'}}
              floatingLabelText="Local port"
              hintText="Local port" 
              value={this.state.port}
              onChange={this.onPortChange}
              type="number" />
          </div>
          <div>
            <TextField 
              style={{width:'100px'}}
              floatingLabelText="Admin port"
              hintText="Admin Port"
              value={this.state.adminPort}
              onChange={this.onAdminPortChange} 
              type="number" />
          </div>
        </div>
        <div style={{float: 'right', border: '1px solid #CCC', width: '400px', height: '270px', marginTop: '20px'}}>
          <img src={'./images/svg/' + this.state.runtime + '.svg'} style={{width: '400px', height: '270px', margin: 'auto', display: 'block'}}/>
          <div style={{float:'right', whiteSpace: 'nowrap'}}>
           <Checkbox
              checkedIcon={<CloudDone />}
              uncheckedIcon={<CloudOff />}
              label="Create cloud project"
              checked={this.state.autoCreate}
              onCheck={this.onAutoCreateCheck}
              labelStyle={{fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#777'}} />
          </div>
        </div>
        <div style={{clear: 'both', marginTop: '15px'}}>
          <TextField 
            style={{width: 'calc(100% - 110px)', marginRight: '20px'}}
            floatingLabelText="Application directory"
            hintText="Application directory" 
            value={this.state.path}
            onChange={this.onPathChange}
            disabled={true} />
          <RaisedButton 
            label="..."
            onClick={this.onUploadClick}>
          </RaisedButton>
        </div>
      </Dialog>
    );
  }
}