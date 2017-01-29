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
import {Env, Runtimes} from './../machines/runtimes';

export default class newAppDialog extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
      title: "New Application",
      runtime: "nodejs",
      env: Env.FLEXIBLE
    }
    
    let manager = this.props.manager;
    let localPath = path.join(os.homedir(), "AppEngineApps");
    fs.mkdir(localPath, err => {});
    
    /**
     * Handle opening the new App Dialog.
     */
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
          runtime: "nodejs",
          autoCreate: true,
          env: Env.FLEXIBLE,
          isEditMode: false,
          title: "New application",
        });
      });
    });    

    /**
     * Handle opening the edit App Dialog. 
     */
    manager.on(AppEvents.SHOW_APP_SETTINGS_DIALOG, (app) => {
      this.setState({
        open: true,
        project: app.name,
        port: app.port,
        adminPort: app.adminPort,
        path: app.path,
        runtime: app.runtime,
        autoCreate: false,
        env: app.env,
        isEditMode: true,
        title: "Edit application settings",
      });
    });
  
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = () => {
    let app = this.state;
    let manager = this.props.manager;
    if (this.state.isEditMode) {
      manager.updateApp(app);
    } else {
      manager.addApp(app);
    }
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
      port: parseInt(event.target.value),
    });
  }

  onAdminPortChange = (event) => {
    this.setState({
      adminPort: parseInt(event.target.value),
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
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSubmit}
      />,
    ];

    let runtime = _.find(Runtimes, { key: this.state.runtime });
    let imagePath = './images/svg/' + runtime.lang + '.svg';
    const runtimes = Runtimes.map((runtime) => {
      return <MenuItem value={runtime.key} primaryText={runtime.label} key={runtime.key} />
    });

    return (
      <Dialog
        title={this.state.title}
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
              disabled={this.state.isEditMode}
              onChange={this.onProjectChange} />
          </div>
          <div>
            <SelectField 
              style={{width:'175px'}}
              floatingLabelText="Language"
              value={this.state.runtime}
              disabled={this.state.isEditMode}
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
        <div style={{float: 'right', border: '1px solid #CCC', width: 'calc(100% - 270px)', height: '270px', marginTop: '20px'}}>
          <img src={imagePath} style={{width: '100%', height: '270px', margin: 'auto', display: 'block'}}/>
          <div style={{float:'right', whiteSpace: 'nowrap'}}>
           <Checkbox
              checkedIcon={<CloudDone />}
              uncheckedIcon={<CloudOff />}
              label="Create cloud project"
              checked={this.state.autoCreate}
              onCheck={this.onAutoCreateCheck}
              disabled={this.state.isEditMode}
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
            disabled={this.state.isEditMode}
            onClick={this.onUploadClick}>
          </RaisedButton>
        </div>
      </Dialog>
    );
  }
}