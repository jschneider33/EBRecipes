import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
 
import * as ROUTES from '../../constants/routes';
 
const SignUpPage = () => (
    <div className="loginDivMain">
        <h1>Sign Up</h1>
        <SignUpForm />
    </div>
);

const INITIAL_STATE = {
    accessCode: '',
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
  };
 
class SignUpFormBase extends Component {
    constructor(props) {
        super(props);

        this.state = {...INITIAL_STATE};
    }
    
    onSubmit = event => {
        const { username, email, passwordOne } = this.state;
 
        this.props.firebase
          .doCreateUserWithEmailAndPassword(email, passwordOne)
          .then(authUser => {
            // Create a user in your Firebase realtime database
            return this.props.firebase
              .user(authUser.user.uid)
              .set({
                username,
                email,
              });
          })
          .then(authUser => {
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.HOME);
          })
          .catch(error => {
            this.setState({ error });
          });
     
        event.preventDefault();
    }
    
    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    };
    
    render() {
        const {
            username,
            email,
            passwordOne,
            passwordTwo,
            accessCode,
            error,
          } = this.state;

        const isInvalid =
          accessCode != 207813413707 ||
          passwordOne !== passwordTwo ||
          passwordOne === '' ||
          email === '' ||
          username === '';
       
          return (
            <form onSubmit={this.onSubmit} className="loginForm">
              <input
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
                className="loginInput"
              />
              <br/>
              <input
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
                className="loginInput"
              />
              <br/>
              <input
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
                className="loginInput"
              />
              <br/>
              <input
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
                className="loginInput"
              />
              <br/>
              <input 
                name="accessCode"
                value={accessCode}
                onChange={this.onChange}
                type="number"
                placeholder="Access Code..."
                className="loginInput"
              />
              <br/>
              <button disabled={isInvalid} type="submit" className="loginButton">Sign Up</button>
       
              {error && <p>{error.message}</p>}
            </form>
        );
    }
    }
    
    const SignUpLink = () => (
    <p>
        Don't have an account? <Link to={ROUTES.SIGNUP}>Sign Up</Link>
    </p>
    );

const SignUpForm = compose(
    withRouter,
    withFirebase,
    )(SignUpFormBase);

export default SignUpPage;
 
export { SignUpForm, SignUpLink };