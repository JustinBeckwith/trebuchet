import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyGridRow from './myGridRow';
import * as AppEvents from './../machines/appEvents';

export default class MyGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      apps: [],
      selectedRows: [],
    }

    let manager = this.props.manager;

    manager.getApps().then((apps) => {
      this.setState({apps: apps});
    });

    // handle app remove events
    manager.on(AppEvents.REMOVED, (app) => {
      this.setState({
        apps: manager.apps
      });
    });

    // handle app add events
    manager.on(AppEvents.APP_CREATED, (app) => {
      this.setState({
        apps: manager.apps
      });
    });

    /**
     * Raise an event for the appBar when selection in the grid changes. 
     */
    this.onRowSelection = (selectedRows) => {
      console.log(selectedRows);
      let selectedApps = [];
      if (selectedRows === "all") {
        selectedApps = this.state.apps;
      } else if (selectedRows === "none") {
        selectedApps = [];
      } else {
        for (let idx in selectedRows) {
          selectedApps.push(this.state.apps[idx]);
        }
      }
      manager.selectionChanged(selectedApps);
    }

    // handle the click of the back button on the action bar
    manager.on(AppEvents.EXIT_SELECTION, () => {
      // There is a bug here.  When selected is set to false, for some reason the grid
      // isn't respecting this setting.  For now, if the user uses 'select all', and then
      // click 'back', deselect won't work.  
      // https://github.com/callemall/material-ui/issues/1897
      this.setState({
        selectedRows: [],
      });
    });
  }

  render() {
    let listItems = this.state.apps.map((app) =>
      <MyGridRow 
        app={app} 
        key={app.name}
        manager={this.props.manager} />
    );
    let displayGrid = listItems.length > 0 ? '' : 'none';
    
    let hideStyle = {
      display: 'none',
    }
    let showStyle = {
      display: '',
    }
    let displayEmpty = listItems.length > 0 ? hideStyle : showStyle;
    
    return (
      <div style={{flexGrow: 1, display: 'flex'}}>
        
        <Table 
          multiSelectable={true} 
          style={{display: displayGrid}}
          onRowSelection={this.onRowSelection}>
          

          <TableHeader>
            <TableRow>
              <TableHeaderColumn className="iconCol"></TableHeaderColumn>
              <TableHeaderColumn className="medCol">Name</TableHeaderColumn>
              <TableHeaderColumn>Path</TableHeaderColumn>
              <TableHeaderColumn className="smallCol">Admin Port</TableHeaderColumn>
              <TableHeaderColumn className="smallCol">Port</TableHeaderColumn>
              <TableHeaderColumn className="iconCol"></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody 
            showRowHover={true}
            deselectOnClickaway={false}>

            {listItems}
          </TableBody>
        </Table>
        <div style={displayEmpty} className="dragBox">
          <div style={{alignSelf: 'center', marginTop: '-100px'}}>  
            <img src="./images/svg/engine.svg" className="logo" />
            Drag a folder into the app, or click the (+) to get started.
          </div>
        </div>
      </div>
    );
  }
}
