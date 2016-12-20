import React from 'react';
import * as AppEvents from './../machines/appEvents';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import {grey500} from 'material-ui/styles/colors';

export default class MyLogPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apps: []
    }
    
    let manager = this.props.manager;
    
    manager.on(AppEvents.VIEW_LOGS, (app) => {
      let defaultApp = this.state.apps.length > 0 ? this.state.apps[0].name : null;
      let definedApp = app ? app.name : null;
      let appName = definedApp ? definedApp : (defaultApp ? defaultApp : '');
      this.handleChange(null, null, appName);
    });

    manager.on(AppEvents.EMIT_LOGS, (app) => {
      this.setState({
        value: app.name
      });
      this.handleChange(null, null, app.name);
    });

    manager.getApps().then((apps) => {
      this.setState({ 
        apps: apps,
        value: apps.length > 0 ? apps[0].name : ''
      });
    });
  }

  handleChange = (event, index, value) => {
    this.setState({
      value: value,
      visible: true
    });
    document.getElementById("logContent").innerText = '';
    this.bindLogger();
  };

  bindLogger = () => {
    let manager = this.props.manager;
    let value = this.state.value;
    manager.getApp(value).then((app) => {
      let log = manager.getAppLog(app);
      if (log != null) {
        log.on("line", (data) => {
          let lc = document.getElementById("logContent");
          let isPinned = (lc.scrollTop === (lc.scrollHeight - lc.offsetHeight));
          let d = document.createElement("div");
          d.innerText = data;
          lc.appendChild(d);
          if (isPinned) {
            lc.scrollTop = lc.scrollHeight;
          }
        });
      }
    });
  }

  closeClick = (e) => {
    e.preventDefault();
    this.setState({
      visible: false
    });
  }
  
  render() {
    let logs = this.state.apps.map(app => 
      <MenuItem value={app.name} primaryText={app.name} key={app.name} />
    );
    return (
      <div className="logViewer" style={{display: this.state.visible ? '' : 'none'}}>
        <div className="logHeader">
          <SelectField style={{fontSize: '13px', color: grey500}}
            className="logSelect"
            value={this.state.value}
            onChange={this.handleChange}>
            {logs}
          </SelectField>
          <IconButton className="logClose" onClick={this.closeClick}>
            <CloseIcon color={grey500} />
          </IconButton>
          <div style={{clear: "both"}}></div>
        </div>
        <div className="logContent" id="logContent"></div>
      </div>
    );
  }
}