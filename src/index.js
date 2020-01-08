import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import registerServiceWorker from "./registerServiceWorker";
import Register from "./components/Auth/register";
import Login from "./components/Auth/login";
import firebase from './firebase';

import "semantic-ui-css/semantic.min.css";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

const Root = () => {
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        return(
          <Redirect to="/"/>
        );
      }
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/login" exact component={Login} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));
registerServiceWorker();
