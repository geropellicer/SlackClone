import React,{useState} from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from '../../firebase';
import Spinner from '../spinner';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const [errorMessages, setErrorMessages] = useState([]);
    const [successMessages, setSuccessMessages] = useState([]);

    const [processingForm, setProcessingForm] = useState(false);


    const updateUsername = (e) => {
        setUsername(e.target.value);
    };
    const updateEmail = (e) => {
        setEmail(e.target.value);
    };
    const updatePassword = (e) => {
        setPassword(e.target.value);
    };
    const updatePasswordConfirmation = (e) => {
        setPasswordConfirmation(e.target.value);
    };


    const formIsValid = () => {
        // To start validation we clear previous error msgs to avoid repetition
        setErrorMessages([]);

        if(!passwordsMatch()) {
            const newError = 'Passwords do not match';
            setErrorMessages(prevErrors => [...prevErrors, newError]);
            return false;
        } else if(!fieldsAreEmpty()){
            const newError = 'Please fill all fields';
            setErrorMessages(prevErrors => [...prevErrors, newError]);
            return false;
        } else if(!passwordIsValid()){
            const newError = 'Password should be at least 8 digits long and contain at least one number and one letter.';
            setErrorMessages(prevErrors => [...prevErrors, newError]);
            return false;
        } else {
            return true;
        }
    };

    const passwordsMatch = () => {
        if(password === passwordConfirmation){
            return true;
        } 
        return false;
    };

    const fieldsAreEmpty = () => {
        if(!password.length || !passwordConfirmation.length || !username.length || !email.length){
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
        if(matchesLetter != null){
            hasLetter = true;
        }

        if(password.length >= 8 && hasNumber && hasLetter){
            return true;
        }
        return false;
    };

    const emptyForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
        setErrorMessages([]); 
    };

    const registrarUsuario = (e) => {
        e.preventDefault();
        if(formIsValid() && !processingForm){
            showSpinner();
            setProcessingForm(true);
            firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(createdUser => {
                console.log(createdUser);
                const newSuccess = 'User created succesfully. You can now log in';
                setSuccessMessages(prevSuccess => [...prevSuccess, newSuccess]);
                emptyForm();
                hideSpinner();
                setProcessingForm(false);
            })
            .catch(err => {
                console.log(err);
                const newError = err.message;
                setErrorMessages(prevErrors => [...prevErrors, newError]);
                hideSpinner();
                setProcessingForm(false);
            })
        }
    };

    const showSpinner = () => {
        document.getElementById("spinnerContainer").classList.add('show');
    };

    const hideSpinner = () => {
        document.getElementById("spinnerContainer").classList.remove('show');
    }

    return(
        <div>
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{  maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="puzzle piece" color="orange"/>
                    Register for DevChat
                </Header>
                <Form size="large" onSubmit={registrarUsuario}>
                    <Segment stacked>
                        <Form.Input fluid name="username" icon="user" iconPosition="left"
                        placeholder="Username" onChange={updateUsername} type="text" value={username} />

                        <Form.Input fluid name="email" icon="mail" iconPosition="left"
                        placeholder="Email address" onChange={updateEmail} type="email" value={email} />

                        <Form.Input fluid name="passwor" icon="lock" iconPosition="left"
                        placeholder="Password" onChange={updatePassword} type="password" value={password} />

                        <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                        placeholder="Password confirmation" onChange={updatePasswordConfirmation} type="password" value={passwordConfirmation} />

                        <Button fluid size="large" color="orange">Register</Button>

                    </Segment>  
                </Form>
                { errorMessages.length > 0 && (
                <Message error>
                    <h3>Error:</h3>
                { errorMessages.map( element => { 
                    return(<p key={element}> {element} </p>); 
                    })
                }
                </Message>
                )}

                { successMessages.length > 0 && (
                <Message success>
                    <h3>Success!</h3>
                    { successMessages.map( element => { 
                        return(<p key={element}> {element} </p>); 
                        })
                    }
                </Message>
                )}
                <Message>Already a user? <Link to="/login">log in.</Link></Message>
            </Grid.Column>
        </Grid>
        <Spinner/>
        </div>
    )
}

export default Register;