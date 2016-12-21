import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const style = {
  marginRight: 20,
};

export default class MyNewButton extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <FloatingActionButton className="newButton">
        <ContentAdd />
      </FloatingActionButton>
    )
  }
}