import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyGridRow from './myGridRow';

export default class MyGrid extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      apps: []
    }
  }

  componentDidMount() {
    let appManager = this.props.manager;
    appManager.getApps().then((apps) => {
      this.setState({apps: apps});
    });
  }

  render() {
    let listItems = this.state.apps.map((app) =>
      <MyGridRow app={app} key={app.path} manager={this.props.manager} />
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
