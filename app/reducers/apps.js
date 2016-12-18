import * as actions from '../actions'
import {shell} from 'electron';

export default function apps(state = {
    isFetching: false,
    apps: []
  }, action) {
  
  switch (action.type) {
    case actions.REQUEST_APPS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case actions.RECEIVE_APPS:
      return Object.assign({}, state, {
        isFetching: false,
        apps: action.apps
      });
    case actions.ADD_APP:
    case actions.START_APP:
      return Object.assign({}, state, {
        app: state.apps.map((app, index) => {
          if (index === action.index) {
            return Object.assign({}, app, {
              status: 'started'
            });
          }
          return app;
        })
      });
    case actions.STOP_APP:
      return state;
    default:
      return state;
  }
}