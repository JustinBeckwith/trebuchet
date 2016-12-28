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
      itemCount: 0,
    }

    let manager = this.props.manager;
    manager.on(AppEvents.SELECTION_CHANGED, (apps) => {
      let visible = (apps.length > 0);
      this.setState({
        visible: visible,
        itemCount: apps.length,
      });
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
        style={{
          display: this.state.visible ? '' : 'none', 
          position: 'absolute',
          backgroundColor: '#f2f2f2',
        }}
        titleStyle={{fontSize: '18px', float: 'left', color: '#212121'}}
        iconStyleLeft={{float: 'left', color: '#212121'}}
        className="selectAppBar"
        iconElementLeft={
          <IconButton onClick={this.backClick}>
            <NavigationBack color="#212121" />
          </IconButton>}>
        
        <span className="numSelectedLabel">{this.state.itemCount} selected</span>
      </AppBar>
    );
  }
}