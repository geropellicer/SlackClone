import React,{useState} from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";


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

    return(
        <Grid textAlign="center" verticalAlign="middle" className="app">
            <Grid.Column style={{  maxWidth: 450 }}>
                <Header as="h2" icon color="orange" textAlign="center">
                    <Icon name="puzzle piece" color="orange"/>
                    Register for DevChat
                </Header>
                <Form size="large">
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