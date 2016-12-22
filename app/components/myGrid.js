import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyGridRow from './myGridRow';
import * as AppEvents from './../machines/appEvents';

export default class MyGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      apps: []
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
  }

  render() {
    let listItems = this.state.apps.map((app) =>
      <MyGridRow 
        app={app} 
        key={app.path} 
        manager={this.props.manager} />
    );
    return (
      <Table multiSelectable={true}>
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
        <TableBody showRowHover={true}>
          {listItems}
        </TableBody>
      </Table>
    );
  }
}
