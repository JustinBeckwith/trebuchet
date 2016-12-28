import React from 'react';
import AppBar from 'material-ui/AppBar';
import * as AppEvents from './../machines/appEvents';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';

export default class SelectAppBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    }

    let manager = this.props.manager;
    manager.on(AppEvents.SELECTION_CHANGED, (apps) => {
      let visible = (apps.length > 0);
      this.setState({
        visible: visible,
      })
    });

    this.backClick = (e) => {
      e.preventDefault();
      this.setState({
        visible: false,
      });
      manager.exitSelection();
    }

  }

  render() {
    return (
      <AppBar
        title="Back"
        style={{display: this.state.visible ? '' : 'none', position: 'absolute'}}
        titleStyle={{fontSize: '14px'}}
        iconStyleLeft={{float: 'left'}}
        className="selectAppBar"
        iconElementLeft={
          <IconButton onClick={this.backClick}>
            <NavigationBack />
          </IconButton>}
      />
    );
  }
}