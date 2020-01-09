import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import Register from "./components/Auth/register";
import Login from "./components/Auth/login";
import firebase from "./firebase";

import "semantic-ui-css/semantic.min.css";

import { createStore } from "redux";
import { Provider, useDispatch, useSelector} from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

import allReducers from "./redux/reducers/combine";
import {setUser} from './redux/actions';

import SpinnerTotal from './components/spinnerTotal';

const store = createStore(
  allReducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


const Root = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoadingUser = useSelector(state => state.user.isLoadingUser);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        dispatch(setUser(user));
        return history.push("/");
      }
    });
  }, [history, dispatch]);

  if(isLoadingUser) {
    return(<SpinnerTotal/>);
  } else {
    return(<Switch>
      <Route path="/" exact component={App} />
      <Route path="/login" exact component={Login} />
      <Route path="/register" exact component={Register} />
      <Route path="/spinner" exact component={SpinnerTotal} />
    </Switch>);
  }
};

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Root />
    </Router>
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
