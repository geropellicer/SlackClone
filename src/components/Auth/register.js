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
import md5 from "md5";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [usersRef, setUsersRef] = useState(firebase.database().ref('users'));

  const [errorMessages, setErrorMessages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const [processingForm, setProcessingForm] = useState(false);

  const updateUsername = e => {
    setUsername(e.target.value);
  };
  const updateEmail = e => {
    setEmail(e.target.value);
  };
  const updatePassword = e => {
    setPassword(e.target.value);
  };
  const updatePasswordConfirmation = e => {
    setPasswordConfirmation(e.target.value);
  };

  const concatenateError = errorMsg => {
    setErrorMessages(prevErrors => [...prevErrors, errorMsg]);
  };

  const formIsValid = () => {
    // To start validation we clear previous error msgs to avoid repetition
    setErrorMessages([]);

    if (!passwordsMatch()) {
      concatenateError("Passwords do not match");
      return false;
    } else if (!fieldsAreEmpty()) {
      concatenateError("Please fill all fields");
      return false;
    } else if (!passwordIsValid()) {
      concatenateError(
        "Password should be at least 8 digits long and contain at least one number and one letter."
      );
      return false;
    } else {
      return true;
    }
  };

  const passwordsMatch = () => {
    if (password === passwordConfirmation) {
      return true;
    }
    return false;
  };

  const fieldsAreEmpty = () => {
    if (
      !password.length ||
      !passwordConfirmation.length ||
      !username.length ||
      !email.length
    ) {
      return false;
    }
    return true;
  };

  const passwordIsValid = () => {
    const matchesNumber = password.match(/\d+/g);
    let hasNumber = false;
    if (matchesNumber != null) {
      hasNumber = true;
    }

    const matchesLetter = password.match(/[a-z]+/i);
    let hasLetter = false;
    if (matchesLetter != null) {
      hasLetter = true;
    }

    if (password.length >= 8 && hasNumber && hasLetter) {
      return true;
    }
    return false;
  };

  const emptyForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
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

  const registrarUsuario = e => {
    e.preventDefault();
    if (formIsValid() && !processingForm) {
      beginLoading();
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(createdUser => {
          console.log(createdUser);
          createdUser.user
            .updateProfile({
              displayName: username,
              photoURL: `http://gravatar.com/avatar/${md5(
                createdUser.user.email
              )}?d=identicon`
            })
            .then(() => {
              saveUser(createdUser).then( () => {
                  setSuccessMessage(
                    "User created succesfully. You can now log in."
                  );
                  emptyForm();
                  stopLoading();
              }).catch( err => {
                exitWithError(err);
              });
            })
            .catch(err => {
                exitWithError(err);
            });
        })
        .catch(err => {
            exitWithError(err);
        });
    }
  };

  const showSpinner = () => {
    document.getElementById("spinnerContainer").classList.add("show");
  };

  const hideSpinner = () => {
    document.getElementById("spinnerContainer").classList.remove("show");
  };

  const saveUser = createdUser => {
      return usersRef.child(createdUser.user.uid).set({
          name: createdUser.user.displayName,
          avatar: createdUser.user.photoURL
      });
  }

  const exitWithError = err => {
    console.log(err);
    concatenateError(err.message);
    stopLoading();
  };

  return (
    <div>
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for DevChat
          </Header>
          <Form size="large" onSubmit={registrarUsuario}>
            <Segment stacked>
              <Form.Input
                fluid
                name="username"
                icon="user"
                iconPosition="left"
                placeholder="Username"
                onChange={updateUsername}
                type="text"
                value={username}
                autoComplete="username"
                className={
                  errorMessages.some(error =>
                    error.toLowerCase().includes("username")
                  )
                    ? "error"
                    : ""
                }
              />

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

              <Form.Input
                fluid
                name="passwordConfirmation"
                icon="repeat"
                iconPosition="left"
                placeholder="Password confirmation"
                onChange={updatePasswordConfirmation}
                type="password"
                value={passwordConfirmation}
                autoComplete="new-password"
                className={
                  errorMessages.some(error =>
                    error.toLowerCase().includes("password")
                  )
                    ? "error"
                    : ""
                }
              />

              <Button fluid size="large" color="orange">
                Register
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
            Already a user? <Link to="/login">Log in.</Link>
          </Message>
        </Grid.Column>
      </Grid>
      <Spinner />
    </div>
  );
};

export default Register;
