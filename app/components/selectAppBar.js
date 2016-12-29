import React from 'react';
import AppBar from 'material-ui/AppBar';
import * as AppEvents from './../machines/appEvents';
import NavigationBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import StartIcon from 'material-ui/svg-icons/av/play-circle-outline';
import StopIcon from 'material-ui/svg-icons/av/pause-circle-outline';
import BrowseIcon from 'material-ui/svg-icons/action/open-in-browser';
import LogsIcon from 'material-ui/svg-icons/communication/clear-all';
import {grey700} from 'material-ui/styles/colors';


export default class SelectAppBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      selectedApps: [],
      itemCount: 0,
    }

    let manager = this.props.manager;
    manager.on(AppEvents.SELECTION_CHANGED, (apps) => {
      let visible = (apps.length > 0);
      this.setState({
        visible: visible,
        itemCount: apps.length,
        selectedApps: apps,
      });
    });

    manager.on(AppEvents.EXIT_SELECTION, () => {
      this.setState({
        visible: false,
      });
    });
  }

  startClick = () => {
    this.onRequestChange(null, "Start");
  }

  browseClick = () => {
    this.onRequestChange(null, "Browse");
  }

  logsClick = () => {
    this.onRequestChange(null, "Logs");
  }

  backClick = (e) => {
    e.preventDefault();
    this.setState({
      visible: false,
    });
    this.props.manager.exitSelection();
  }

  /**
   * Handle click of the menu item from the (...) menu.
   */
  onRequestChange = (source, value) => {      
    let manager = this.props.manager;
    let fn = null;
    switch(value) {
      case "Start":
        fn = manager.startApp;
        break;
      case "Stop":
        fn = manager.stopApp;
        break;
      case "SDK Console":
        fn = manager.openSDKConsole;
        break;
      case "Browse":
        fn = manager.browseApp;
        break;
      case "Dashboard":
        fn = manager.openConsole;
        break;
      case "Remove":
        fn = manager.removeApp;
        break;
      case "Deploy":
        fn = manager.deployApp;
        break;
      case "Logs":
        fn = manager.viewLogs;
        break;
    }
    this.state.selectedApps.forEach(app => fn(app));
    this.setState({
      visible: false,
    });
    this.props.manager.exitSelection();
  }
  

  render() {
  
    let dotStyle = {
      
    }

    let titleStyle = {
      color: grey700,
      fontSize: '18px',
      flex: "0 0 auto",
    }

    let iconStyleLeft = {
      color: grey700,
      marginTop: '0px',
    }

    return (  
      <AppBar
        title="Back"
        style={{
          display: this.state.visible ? 'flex' : 'none', 
          position: 'absolute',
          backgroundColor: '#f2f2f2',
          alignItems: 'center',
        }}
        titleStyle={titleStyle}
        iconStyleLeft={iconStyleLeft}
        className="selectAppBar"
        iconElementLeft={
          <IconButton onClick={this.backClick}>
            <NavigationBack color="#212121" />
          </IconButton>}
        >
        
        <span className="numSelectedLabel">{this.state.itemCount} selected</span> 

        <IconButton style={dotStyle} onClick={this.startClick} tooltip="Start application">
          <StartIcon color={grey700} />
        </IconButton>
        <IconButton style={dotStyle} onClick={this.browseClick} tooltip="Open in browser">
          <BrowseIcon color={grey700} />
        </IconButton>
        <IconButton style={dotStyle} onClick={this.logsClick} tooltip="View logs">
          <LogsIcon color={grey700} />
        </IconButton>
        
        
        <IconMenu 
          style={dotStyle}
          onChange={this.onRequestChange}
          iconButtonElement={
            <IconButton>
              <MoreVertIcon color={grey700}/>
            </IconButton>}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}} >
          
          <MenuItem primaryText="Remove" value="Remove" />
          <MenuItem primaryText="Start" value="Start" />
          <MenuItem primaryText="Stop" value="Stop" />
          <Divider />
          <MenuItem primaryText="Browse" value="Browse" />
          <MenuItem primaryText="Logs" value="Logs" />
          <MenuItem primaryText="SDK Console" value="SDK Console" />
          <Divider />
          <MenuItem primaryText="Deploy" value="Deploy" />
          <MenuItem primaryText="Dashboard" value="Dashboard" />
        </IconMenu>
        
        
      </AppBar>
    );
  }
}