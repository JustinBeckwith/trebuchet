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
    this.state = {
      visible: false,
    }

    let manager = this.props.manager;
    console.log("Getting those apps....");
    manager.getApps().then(apps => {
      this.setState({
        visible: (apps.length > 0),
      });
    }).catch(err => {
      console.log(err);
    });

    // handle app remove events
    manager.on(AppEvents.REMOVED, (app) => {
      this.setState({
        visible: manager.apps.length > 0,
      });
    });

    // handle app add events
    manager.on(AppEvents.APP_CREATED, (app) => {
      this.setState({
        visible: manager.apps.length > 0,
      });
    });
  }



  handleChange = (event, value) => {
    switch(value) {
      case AppEvents.VIEW_LOGS:
        this.props.manager.viewLogs();
        break;
    }
  }

  startAll = () => {
    let manager = this.props.manager;
    manager.getApps().then((apps) => {
      apps.map((app) => {
        manager.startApp(app);
      });
    });
  }

  render() {
    return (
      <Toolbar style={{display: this.state.visible ? '' : 'none'}}>
        <ToolbarGroup firstChild={true}>
          <div></div>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarTitle text="Options" />
          <FontIcon className="muidocs-icon-custom-sort" />
          <ToolbarSeparator />
          <RaisedButton label="Start All" primary={true} onClick={this.startAll}  />
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