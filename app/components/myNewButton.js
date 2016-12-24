import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {List, ListItem} from 'material-ui/List';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import ContentSend from 'material-ui/svg-icons/content/send';
import ContentDrafts from 'material-ui/svg-icons/content/drafts';
import Popover from 'material-ui/Popover';

export default class MyNewButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    };
  }
  
  newClick = (event) => {
    event.preventDefault();
    this.setState({
      showMenu: true,
      anchorEl: document.getElementById('anchorEl')
    })
  }

  handleRequestClose = () => {
    this.setState({
      showMenu: false,
    });
  };

  onMenuItemClick = (event) => {
    let value = event.currentTarget.getAttribute('value');
    switch(value) {
      case "new":
        this.props.manager.newApp();
        break;
      case "import":
        this.props.manager.showImportApp();
        break;
    }
    this.setState({
      showMenu: false,
    });
  }


  render() {
    return (
      <div className="newButton">
        <Popover
          open={this.state.showMenu}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
          onRequestClose={this.handleRequestClose}
        >
          <List>
            <ListItem 
              primaryText="New application" 
              leftIcon={<ContentInbox />} 
              value="new"
              onClick={this.onMenuItemClick} />
            <ListItem 
              primaryText="Import application" 
              leftIcon={<ActionGrade />} 
              value="import"
              onClick={this.onMenuItemClick} />
          </List>
        </Popover>
        <div id="anchorEl" style={{paddingTop: '50px'}}>
          <FloatingActionButton onClick={this.newClick}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </div>
    )
  }
}