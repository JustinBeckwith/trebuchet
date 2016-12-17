import React from 'react';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyStatusIcon from './myStatusIcon';

export default class myGridRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { app, order, ...other } = this.props;
    console.log(this.props);
    return (
      <TableRow {...other} selectable={true}> 
        
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
          <IconMenu iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}>
            <MenuItem primaryText="Info" />
            <MenuItem primaryText="Edit" />
            <Divider />
            <MenuItem primaryText="Run" />
            <MenuItem primaryText="Stop" />
            <MenuItem primaryText="Browse" />
            <MenuItem primaryText="Logs" />
            <MenuItem primaryText="SDK Console" />
            <Divider />
            <MenuItem primaryText="Deploy" />
            <MenuItem primaryText="Dashboard" />
          </IconMenu>
       </TableRowColumn>
     </TableRow>
    );
  }
}