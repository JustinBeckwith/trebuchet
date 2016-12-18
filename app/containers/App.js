import React, {PropTypes, Component} from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MyAppBar from '../components/myAppBar';
import MyGrid from '../components/myGrid';
import MyToolbar from '../components/myToolbar';
import * as Actions from '../actions'

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(Actions.fetchAppsIfNeeded());
  } 

  render() {
    const { apps, isFetching } = this.props;
    return (
      <MuiThemeProvider>
        <div>
          <MyAppBar />
          <MyToolbar />
          <MyGrid apps={apps} />
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  apps: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {  
  const { isFetching, apps } = state.apps || {
    isFetching: true,
    apps: []
  };

  return {
    apps,
    isFetching
  }
}

export default connect(mapStateToProps)(App)