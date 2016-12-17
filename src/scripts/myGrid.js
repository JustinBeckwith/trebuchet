import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import MyGridRow from './myGridRow';

export default class MyGrid extends React.Component {

  constructor(props) {
    super(props);
  }

  getListItems() {
    let data = [{
      name: "shell-php",
      path: "~/minishell",
      adminPort: 8003,
      status: "started",
      port: 11080
    }, {
      name: "boo",
      path: "/some/path/12345",
      adminPort: 9876,
      status: "stopped",
      port: 890
    }, {
      name: "moo",
      path: "/some/person/45",
      adminPort: 194,
      status: "starting",
      port: 235
    }, {
      name: "doo",
      path: "/some/path/1dddd5",
      adminPort: 3456,
      status: "stopping",
      port: 44
    }
   ];

   return data.map((app) =>
     <MyGridRow app={app} key={app.path} />
   );
  }

  render() {
    let listItems = this.getListItems();
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
