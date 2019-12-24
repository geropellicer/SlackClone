import React,{useState} from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from '../../firebase';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

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

    const [errorMessages, setErrorMessages] = useState([]);

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

        console.log("Has letter: " + hasLetter + " - Has number: " + hasNumber);

        if(password.length >= 8 && hasNumber && hasLetter){
            return true;
        }
        return false;
    };

    const registrarUsuario = (e) => {
        e.preventDefault();
        if(formIsValid()){
            firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .then(createdUser => {
                console.log(createdUser);
            })
            .catch(err => {
                console.log(err);
            })
        }
    };

    return(
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
                <Message>Already a user? <Link to="/login">log in.</Link></Message>
            </Grid.Column>
        </Grid>
    )
}

export default Register;