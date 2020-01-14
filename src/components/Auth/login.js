import React, { useState } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Message,
  Icon
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import Spinner from "../spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [processingForm, setProcessingForm] = useState(false);

  const updateEmail = e => {
    setEmail(e.target.value);
  };
  const updatePassword = e => {
    setPassword(e.target.value);
  };

  const concatenateError = errorMsg => {
    setErrorMessages(prevErrors => [...prevErrors, errorMsg]);
  };

  const formIsValid = () => {
    // To start validation we clear previous error msgs to avoid repetition
    setErrorMessages([]);

    if (!fieldsAreEmpty()) {
      concatenateError("Please fill all fields");
      return false;
    } else {
      return true;
    }
  };

  const fieldsAreEmpty = () => {
    if (!password.length || !email.length) {
      return false;
    }
    return true;
  };

  const emptyForm = () => {
    setEmail("");
    setPassword("");
    setErrorMessages([]);
  };

  const beginLoading = () => {
    showSpinner();
    setProcessingForm(true);
  };

  const stopLoading = () => {
    hideSpinner();
    setProcessingForm(false);
  };

  const showSpinner = () => {
    document.getElementById("spinnerContainer").classList.add("show");
  };

  const hideSpinner = () => {
    document.getElementById("spinnerContainer").classList.remove("show");
  };

  const exitWithError = err => {
    setSuccessMessage("");
    console.log(err);
    concatenateError(err.message);
    stopLoading();
  };

  const exitWithSuccess = msg => {
    setErrorMessages([]);
    setSuccessMessage(msg);
    emptyForm();
    stopLoading();
  };

  const logearUsuario = e => {
    e.preventDefault();
    if (formIsValid() && !processingForm) {
      beginLoading();
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          exitWithSuccess(
            `Welcome back ${signedInUser.user.displayName}. You are now logged in.`
          );
        })
        .catch(err => {
          exitWithError(err);
        });
    }
  };

  return (
    <div>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="violet" textAlign="center">
            <Icon name="puzzle piece" color="violet" />
            Login to DevChat
          </Header>
          <Form size="large" onSubmit={logearUsuario}>
            <Segment stacked>
              <Form.Input
                fluid
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email address"
                onChange={updateEmail}
                type="email"
                value={email}
                autoComplete="email"
                className={
                  errorMessages.some(error =>
                    error.toLowerCase().includes("email")
                  )
                    ? "errror"
                    : ""
                }
              />

              <Form.Input
                fluid
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                onChange={updatePassword}
                type="password"
                value={password}
                autoComplete="new-password"
                className={
                  errorMessages.some(error =>
                    error.toLowerCase().includes("password")
                  )
                    ? "error"
                    : ""
                }
              />

              <Button fluid size="large" color="violet">
                Log in
              </Button>
            </Segment>
          </Form>
          {errorMessages.length > 0 && (
            <Message error>
              <h3>Error:</h3>
              {errorMessages.map(element => {
                return <p key={element}> {element} </p>;
              })}
            </Message>
          )}

          {successMessage && (
            <Message success>
              <h3>Success!</h3>
              <p> {successMessage} </p>
            </Message>
          )}
          <Message>
            Don't have an account? <Link to="/register">Register.</Link>
          </Message>
        </Grid.Column>
      </Grid>
      <Spinner />
    </div>
  );
};

export default Login;
