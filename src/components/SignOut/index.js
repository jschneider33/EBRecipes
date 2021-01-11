import React from 'react';
 
import { withFirebase } from '../Firebase';

import './index.css'
 
const SignOutButton = ({ firebase }) => (
  <button type="button" onClick={firebase.doSignOut} className="signOutButton">
    Sign Out
  </button>
);
 
export default withFirebase(SignOutButton);