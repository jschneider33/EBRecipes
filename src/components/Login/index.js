import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
 
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import { ForgotPasswordLink } from '../ForgotPassword';

import * as ROUTES from '../../constants/routes';

import './index.css';
 
const LoginPage = () => (
  <div className="loginDivMain">
    <h1>Login</h1>
    <LoginForm />
    <ForgotPasswordLink />
    <SignUpLink />
  </div>
);
 
const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};
 
class LoginFormBase extends Component {
  constructor(props) {
    super(props);
 
    this.state = { ...INITIAL_STATE };
  }
 
  onSubmit = event => {
    const { email, password } = this.state;
 
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
 
    event.preventDefault();
  };
 
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
 
  render() {
    const { email, password, error } = this.state;
 
    const isInvalid = password === '' || email === '';
 
    return (
      <div className="loginDivMain">
        <h1>Login</h1>
        
      
        <form onSubmit={this.onSubmit} className="loginForm">
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
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            placeholder="Password"
            className="loginInput"
          />
          <br/>
          <button disabled={isInvalid} type="submit" className="loginButton">
            Sign In
          </button>
  
          {error && <p>{error.message}</p>}
        </form>
        <ForgotPasswordLink />
        <SignUpLink />
      </div>
    );
  }
}
 
const LoginForm = compose(
  withRouter,
  withFirebase,
)(LoginFormBase);
 
// export default LoginPage;
 
// export { LoginForm };

export default LoginForm