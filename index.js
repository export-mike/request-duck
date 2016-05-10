import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

const IN_FLIGHT = '@@request/IN_FLIGHT';
const SUCCESS = '@@request/SUCCESS';
const FAIL = '@@request/FAIL';

const inFlight = scope => ({type: IN_FLIGHT, payload: {scope}});
const success = scope => ({type: SUCCESS, payload: {scope}});
const fail = (scope, e) => ({type: FAIL, payload: {scope, e}});

const request = scope => fn => dispatch => {
  dispatch(inFlight(scope));

  return fn()
  .then(() => dispatch(success(scope)))
  .catch((e) => dispatch(fail(scope, e)));
};

export default ({scope, mountPoint = 'request'}) => Component => {

  const HOC = props => {
    return <Component {...props}/>;
  };

  const mapStateToProps = state => {
    if (!state[mountPoint]) {
      throw new Error(`You need to mount the request reducer at ${mountPoint}`);
    }

    const scopeState = state[mountPoint][scope] ? state[mountPoint][scope] : {
      error: null,
      isFetching: false
    };

    return { [scope]: scopeState };
  };

  const mapDispatchToProps = (dispatch) => ({
    request: bindActionCreators({request: request(scope)}, dispatch).request,
    dispatch
  });

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
};

const initialState = {};
const scopeState = (o = {}) => ({
  isFetching: false,
  error: null,
  ...o
});

export function reducer(state = initialState, {type, payload} = {}) {

  if (type === IN_FLIGHT) {
    return Object.assign({}, state, {
      [payload.scope]: scopeState({
        isFetching: true,
        error: null
      })
    });
  }

  if (type === SUCCESS) {
    return Object.assign({}, state, {
      [payload.scope]: scopeState({
        isFetching: false
      })
    });
  }

  if (type === FAIL) {
    return Object.assign({}, state, {
      [payload.scope]: scopeState({
        error: payload.error
      })
    });
  }

  return state;
}
