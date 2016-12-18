import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyGridRow from './myGridRow';

export default class MyGrid extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let { apps } = this.props;
    let listItems = apps.map((app) =>
      <MyGridRow app={app} key={app.path} />
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
