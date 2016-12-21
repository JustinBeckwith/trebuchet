import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAppBar from './myAppBar';
import MyGrid from './myGrid';
import MyToolbar from './myToolbar';
import MySnackbar from './mySnackbar';
import MyCloudSdkDialog from './myCloudSdkDialog';
import MyLogPane from './myLogPane';
import MyNewButton from './myNewButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {fade} from 'material-ui/utils/colorManipulator';
import {
  blue700, blue900, 
  grey100, grey300, grey400, grey500,
  pinkA200,  
  darkBlack, fullBlack, 
  white
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue700,
    primary2Color: blue900,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: blue700,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fullBlack,
  },
});

export default class MyMainApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="fullContainer">
          <div className="topContainer">
            <MyAppBar />
            <MyToolbar manager={this.props.manager} />
            <MyGrid manager={this.props.manager} />
            <MySnackbar manager={this.props.manager} />
            <MyCloudSdkDialog manager={this.props.manager} />
            <MyNewButton />
          </div>
          <MyLogPane manager={this.props.manager} />
        </div>
      </MuiThemeProvider>
    );
  }
}
