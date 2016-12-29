import React from 'react';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import StartIcon from 'material-ui/svg-icons/av/play-circle-outline';
import StopIcon from 'material-ui/svg-icons/av/pause-circle-outline';
import BrowseIcon from 'material-ui/svg-icons/action/open-in-browser';
import LogsIcon from 'material-ui/svg-icons/communication/clear-all';
import {grey700} from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyStatusIcon from './myStatusIcon';
import * as AppStates from './../machines/appStates';
import * as AppEvents from './../machines/appEvents';
import TableRowColumnWrapper from './tableRowColumnWrapper';

export default class myGridRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isMenuOpen: false,
      app: this.props.app,
      action: "Start", 
    }
    
    let manager = this.props.manager;
    manager.on(AppEvents.STATUS_CHANGED, (app) => {
      if (this.state.app.name === app.name) {
        let isStopped = (app.status == AppStates.STOPPED);
        let action = isStopped ? "Start" : "Stop";
        this.setState({
          action: action,
          app: app,
        });
      }
    });
    
  }

  onRowHover = () => {
    this.setState({ isHovered: true });
  }

  onRowHoverExit = () => {
    this.setState({ isHovered: false });
  }

  startClick = (e) => {
    e.preventDefault();
    this.onRequestChange(null, "Start");
  }

  stopClick = (e) => {
    e.preventDefault();
    this.onRequestChange(null, "Stop");
  }

  logsClick = (e) => {
    e.preventDefault();
    this.onRequestChange(null, "Logs");
  }

  browseClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.onRequestChange(null, "Browse");
  }

  onRequestChange = (source, value) => {  
    // This doesn't work unless there's a value on the menu item that's selected.
    // https://github.com/callemall/material-ui/issues/3995
    //this.setState({ isMenuOpen: open });
    let { app } = this.props;
    let appManager = this.props.manager;
    switch(value) {
      case "Start":
        appManager.startApp(app);
        break;
      case "Stop":
        appManager.stopApp(app);
        break;
      case "SDK Console":
        appManager.openSDKConsole(app);
        break;
      case "Browse":
        appManager.browseApp(app);
        break;
      case "Dashboard":
        appManager.openConsole(app);
        break;
      case "Remove":
        appManager.removeApp(app);
        break;
      case "Deploy":
        appManager.deployApp(app);
        break;
      case "Logs":
        appManager.viewLogs(app);
        break;
      case "Remove":
        appManager.removeApp(app);
        break;
    }
    // de-select items after the command is run
    appManager.exitSelection();
  }

  onRowClick = (e) => {
    console.log("ON ROW CLICK");
    console.log(e);
    e.preventDefault();
    e.stopPropagation();
  }

  getIconStyle() {
    //return this.state.isHovered || this.state.isMenuOpen ? {display: "inline-block"} : {display: "none"};
    // This doesn't work.  https://github.com/callemall/material-ui/issues/3995
    return {};
  }

  render() {
    let { app, manager, ...other } = this.props;
    app = this.state.app;
    return (
      <TableRow 
        {...other} 
        onClick={this.onRowClick}
        onRowHover={this.onRowHover} 
        onRowHoverExit={this.onRowHoverExit}>

        
        {/* Hack:  https://github.com/callemall/material-ui/issues/2608 */}
        {other.children[0]}
        
        <TableRowColumnWrapper className="iconCol">
          <MyStatusIcon status={app.status} />
        </TableRowColumnWrapper>
        <TableRowColumnWrapper className="medCol">{app.name}</TableRowColumnWrapper>
        <TableRowColumnWrapper className="smallCol">{app.port}</TableRowColumnWrapper>
        <TableRowColumnWrapper>{app.path}</TableRowColumnWrapper>
        <TableRowColumnWrapper className="iconCol">
          
          <div className="rowIcons">
            <IconButton style={{display: (this.state.isHovered && this.state.app.status == AppStates.STOPPED) ? '' : 'none'}} 
                        onClick={this.startClick}>
              <StartIcon color={grey700} />
            </IconButton>
            <IconButton style={{display: (this.state.isHovered && this.state.app.status == AppStates.STARTED) ? '' : 'none'}} 
                        onClick={this.stopClick}>
              <StopIcon color={grey700} />
            </IconButton>
            <IconButton style={{display: this.state.isHovered ? '' : 'none'}} 
                        onClick={this.browseClick}>
              <BrowseIcon color={grey700} />
            </IconButton>
            <IconButton style={{display: this.state.isHovered ? '' : 'none'}} 
                        onClick={this.logsClick}>
              <LogsIcon color={grey700} />
            </IconButton>
          </div>

          <IconMenu style={this.getIconStyle()} 
                    onChange={this.onRequestChange}
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}} 
                    >
            <MenuItem primaryText="Edit" value="Edit" />
            <MenuItem primaryText="Remove" value="Remove" />
            <Divider />
            <MenuItem primaryText={this.state.action}
              value={this.state.action}
              disabled={app.status == AppStates.STARTING || app.status == AppStates.STOPPING} />
            <MenuItem primaryText="Browse" value="Browse" />
            <MenuItem primaryText="Logs" value="Logs" />
            <MenuItem primaryText="SDK Console" value="SDK Console" />
            <Divider />
            <MenuItem primaryText="Deploy" value="Deploy" />
            <MenuItem primaryText="Dashboard" value="Dashboard" />
          </IconMenu>
          
       </TableRowColumnWrapper>
     </TableRow>
    );
  }
}