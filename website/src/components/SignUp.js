import React from 'react';
import Login from './Login';
const {HashPassword} = require("../node_scripts/Hasher")

function SignUp() {
  return (
    <Login action="Sign up" func="signup"/>    
  );
}

export default SignUp;
