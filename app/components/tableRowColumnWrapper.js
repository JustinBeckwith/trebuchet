import React from 'react';
import {TableRowColumn} from 'material-ui';

/**
 * This is a hack. By default, the TableRow click event of the material-ui TableRow
 * assumes click === selection.  We don't want that, especially in the case of 
 * action button clicks in the row.  This allows us to override the default behavior
 * of the tableRowColumn clicking.  Once this bug is addressed, the wrapping can go away.
 * https://github.com/callemall/material-ui/issues/4535
 */
export default class TableRowColumnWrapper extends React.Component {

  onCellClick = (e) => {
    // do nothing. 
  }

  render() {
    let {...others} = this.props;
    return (
      <TableRowColumn 
        {...others} 
        style={this.props.style} 
        onClick={this.onCellClick}>

        {this.props.children}
      </TableRowColumn>
    );
  }
}