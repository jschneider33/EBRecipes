import React from 'react'
import './index.css';

import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import HomePage from '../Home';
import NewRecipePage from '../NewRecipe';
import SingleRecipePage from '../SingleRecipe';
import SignUpPage from '../SignUp';
import LoginPage from '../Login';
import ForgotPasswordPage from '../ForgotPassword';
// import AccountPage from '../Account';
// import AdminPage from '../Admin';

import { withAuthentication } from '../Session';

 
import * as ROUTES from '../../constants/routes';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
            <Navigation />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route exact path={ROUTES.NEWRECIPE} component={NewRecipePage} />
            <Route exact path={ROUTES.LOGIN} component={LoginPage} />
            <Route exact path={ROUTES.SIGNUP} component={SignUpPage} />
            <Route exact path={ROUTES.FORGOT_PASSWORD} component={ForgotPasswordPage} />
            <Route path={ROUTES.SINGLERECIPE} component={SingleRecipePage} />
  </Router>
  );
}

export default withAuthentication(App);
