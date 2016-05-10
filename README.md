# request-duck
redux duck for adding isFetching error props to a given container component, scoped so props do not clash.

``` JavaScript
import {reducer as request} from './';

export default combineReducers({
  request,
  ... // other reducers
});


import request from './';

class Container extends Component {

 componentWillMount() {
  this.props.request(() => this.props.actions.fetchDataFromApi());
 }
 
 render() {
    return (
      { props.myContainer.isFetching && <div> {'Loading ...'}</div>}
      { props.myContainer.error && <div> {'Error Loading'} </div> }
    );
  }
}

export default request(
  scope: 'myContainer'
)(Container);

```
