import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import * as AppEvents from './../machines/appEvents';

export default class MyToolbar extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (event, value) => {
    switch(value) {
      case AppEvents.VIEW_LOGS:
        this.props.manager.viewLogs();
        break;
    }
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <div></div>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Options" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Start All" primary={true}  />
          <IconMenu  iconButtonElement={
              <IconButton touch={true}>
                <NavigationExpandMoreIcon />
              </IconButton> 
            } onChange={this.handleChange}>
            <MenuItem primaryText="View Logs" value={AppEvents.VIEW_LOGS} />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}