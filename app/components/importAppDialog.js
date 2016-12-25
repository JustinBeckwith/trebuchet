import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import * as AppEvents from './../machines/appEvents';
import {remote} from 'electron';
import generate from 'project-name-generator';
import os from 'os';
import fs from 'fs';
import path from 'path';
import YAML from 'js-yaml';

export default class importAppDialog extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      open: false,
    }
    
    let manager = this.props.manager;
    manager.on(AppEvents.SHOW_IMPORT_APP, () => {
      this.getNextPort().then((port) => {
        let name = generate({ number: true }).dashed;
        this.setState({
          open: true,
          generatedName: name,
          project: name,
          port: port,
          adminPort: port+1,
          path: "",
          formInvalid: true,
          cloudSettings: 'newCloudProject',
          pathErrorText: '',
          formInvalid: true,
          runtime: 'python',
          env: 'standard',
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

  handleSubmit = () => {
    let app = this.state;
    this.props.manager.importApp(app);
    this.setState({open: false});
  };

  onProjectChange = (event) => {
    this.setState({
      project: event.target.value,
    });
  }

  onPathChange = (event) => {
    this.setState({
      path: event.target.value,
    }, () => {
      this.checkFormValid();
      this.getAppInfo();
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

  onUploadClick = () => {
    let result = remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'],
      defaultPath: this.state.path || os.homedir()
    });
    if (result && result.length > 0) {
      this.setState({
        path: result[0],
      }, () => {
        this.checkFormValid();
        this.getAppInfo();
      });
    }
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

  onCloudSettingsChange = (event, value) => {
    this.setState({
      cloudSettings: value,
    });
  }

  checkFormValid = () => {
    if (!this.state.path || this.state.path == '' ) {
      this.setValidState(false);
    } else {
      fs.stat(this.state.path, (err, stats) => {
        let pathValid = !err && stats.isDirectory();
        this.setValidState(pathValid);
      });
    }
  }

  getAppInfo = () => {
    let yamlPath = path.join(this.state.path, "app.yaml");
    fs.readFile(yamlPath, 'utf8', (err, data) => {
      if (err) {
        // if there's an err... assume this is flex and the app.yaml will be auto-generated?
        this.setState({ env: "flex"});
      } else {
        let config = YAML.safeLoad(data);
        console.log(config);
        let env = config.env ? config.env : "standard";
        if (config.vm == "true" || config.env == "flexible") {
          env = "flex";
        }
        this.setState({
          env: env,
        });
        
        let runtime = config.runtime;
        if (config.runtime) {
          if (config.runtime.indexOf('python') == 0) {
            runtime = "python";
          } else if (config.runtime.indexOf('php') == 0) {
            runtime = "php";
          } else if (config.runtime.indexOf('java') == 0) {
            runtime = "java";
          }
        }
        
        this.setState({
          runtime: runtime,
        });
        
      }
    });
  }

  setValidState = (isValid) => {
    let errorText = isValid ? "" : "Please choose a valid application path.";
    this.setState({
      pathErrorText:  errorText,
      formInvalid: !isValid,
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
        disabled={this.state.formInvalid}
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <Dialog
        title="Import application"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
        autoScrollBodyContent={true}>

        <div>
          <TextField 
            style={{width: 'calc(100% - 110px)', marginRight: '20px'}}
            floatingLabelText="Application directory"
            hintText="Application directory" 
            errorText={this.state.pathErrorText}
            value={this.state.path}
            onChange={this.onPathChange} />
          <RaisedButton 
            label="..."
            onClick={this.onUploadClick}>
          </RaisedButton>
        </div>

        <div style={{marginBottom: '15px'}}>
          <TextField 
            style={{width:'100px', marginRight: '20px'}}
            floatingLabelText="Local port"
            hintText="Local port" 
            value={this.state.port}
            onChange={this.onPortChange}
            type="number" />
        
          <TextField 
            style={{width:'100px'}}
            floatingLabelText="Admin port"
            hintText="Admin Port"
            value={this.state.adminPort}
            onChange={this.onAdminPortChange} 
            type="number" />

        </div>
        
        <div>
          <div>Cloud project</div>
          <RadioButtonGroup 
            name="cloudSettings" 
            defaultSelected="newCloudProject"
            onChange={this.onCloudSettingsChange}
            valueSelected={this.state.cloudSettings}>

            <RadioButton
              value="newCloudProject"
              label="Create new cloud project" />
            <RadioButton
              value="linkExistingCloudProject"
              label="Link to existing cloud project" />
            <RadioButton
              value="noCloudProject"
              label="No cloud project" />
          </RadioButtonGroup>
        </div>

        <div>
          <TextField 
            hintText="Project" 
            floatingLabelText="Project name"
            value={this.state.project}
            onChange={this.onProjectChange} />
        </div>
          
        
      </Dialog>
    );
  }
}