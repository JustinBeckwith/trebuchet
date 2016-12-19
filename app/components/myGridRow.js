import React from 'react';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyStatusIcon from './myStatusIcon';
import * as AppStates from './../machines/appStates';
import * as AppEvents from './../machines/appEvents';

export default class myGridRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isMenuOpen: false,
      app: this.props.app
    }
    
    this.props.manager.on(AppEvents.STATUS_CHANGED, (app) => {
      this.setState(this.state);
    });
    
  }

  onRowHover = () => {
    this.setState({ isHovered: true });
  }

  onRowHoverExit = () => {
    this.setState({ isHovered: false });
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
    }
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
      <TableRow {...other} onRowHover={this.onRowHover} onRowHoverExit={this.onRowHoverExit}>
        
        {/* Hack:  https://github.com/callemall/material-ui/issues/2608 */}
        {other.children[0]}
        
        <TableRowColumn className="iconCol">
          <MyStatusIcon status={app.status} />
        </TableRowColumn>
        <TableRowColumn className="medCol">{app.name}</TableRowColumn>
        <TableRowColumn>{app.path}</TableRowColumn>
        <TableRowColumn className="smallCol">{app.adminPort}</TableRowColumn>
        <TableRowColumn className="smallCol">{app.port}</TableRowColumn>
        <TableRowColumn className="iconCol">
          <IconMenu style={this.getIconStyle()} 
                    onChange={this.onRequestChange}
                    iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}} 
                    >
            <MenuItem primaryText="Info" value="Info" />
            <MenuItem primaryText="Edit" value="Edit" />
            <MenuItem primaryText="Remove" value="Remove" />
            <Divider />
            <MenuItem primaryText="Start" value="Start" disabled={app.status == AppStates.STARTED || app.status == AppStates.STARTING} />
            <MenuItem primaryText="Stop" value="Stop" disabled={app.status == AppStates.STOPPED || app.status == AppStates.STOPPING} />
            <MenuItem primaryText="Browse" value="Browse" />
            <MenuItem primaryText="Logs" value="Logs" />
            <MenuItem primaryText="SDK Console" value="SDK Console" />
            <Divider />
            <MenuItem primaryText="Deploy" value="Deploy" />
            <MenuItem primaryText="Dashboard" value="Dashboard" />
          </IconMenu>
       </TableRowColumn>
     </TableRow>
    );
  }
}