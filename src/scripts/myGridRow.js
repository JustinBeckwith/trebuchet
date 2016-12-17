import React from 'react';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyStatusIcon from './myStatusIcon';
import {shell} from 'electron';

export default class myGridRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
      isMenuOpen: false
    }
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
    console.log(value);
    switch(value) {
      case "Run":
        break;
      case "Stop":
        break;
      case "SDK Console":
        shell.openExternal(`http://localhost:${this.props.app.adminPort}`);
        break;
      case "Browse":
        shell.openExternal(`http://localhost:${this.props.app.port}`);
        break;
      case "Dashboard":
        shell.openExternal(`https://console.cloud.google.com/appengine?project=${this.props.app.name}`);
        break;
    }
  }

  getIconStyle() {
    //return this.state.isHovered || this.state.isMenuOpen ? {display: "inline-block"} : {display: "none"};
    // This doesn't work.  https://github.com/callemall/material-ui/issues/3995
    return {};
  }

  render() {
    let { app, order, ...other } = this.props;
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
            <Divider />
            <MenuItem primaryText="Run" value="Run" />
            <MenuItem primaryText="Stop" value="Stop" />
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