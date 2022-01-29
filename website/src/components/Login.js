import {React, useState} from 'react';
import './Login.css'
import {HashPassword} from "../node_scripts/Hasher"
import {useNavigate} from 'react-router'

function Login(props) {
  const {action, func} = props
  const [errorMessage, setErrorMessage] = useState()
  const buttonAction = (func == "login") ? LoginButtonAction : SignUpButtonAction;
  async function LoginButtonAction(e){
    // Stop page from reloading on submit
    e.preventDefault();
    // Get values from the input boxes
    const email = document.querySelector("#email-input").value
    const password =  document.querySelector("#password-input").value
    // Send request to login endpoint
    const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/login", {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    // Get data from response
    const data = await response.json();
    // Check if email doesn't exist in database
    if(data['status'] === 'no email'){
      setErrorMessage(<h1 className="error-message roboto-bold-black-36px">
        Email not in database!
    </h1>)
    }
    else if(data['status'] === 'wrong'){
      setErrorMessage(<h1 className="error-message roboto-bold-black-36px">
        Wrong password!
    </h1>)
    }
    else if(data["status"] === "work"){
      history("/wishlist");
      window.location.reload(false);
    }
    console.log(data);
  }
  async function SignUpButtonAction(e){
    // Prevent page from reloading 
    e.preventDefault();
    // Get inputted email and password from respective ids 
    const email = document.querySelector("#email-input").value
    const password = await HashPassword(document.querySelector("#password-input").value)
    const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/signup", {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, password: password })
    })
    const data = await response.json();
    if(data['status'] === 'email already used'){
      setErrorMessage(<h1 className="error-message roboto-bold-black-36px">
        Email already used!
    </h1>)
    }
    else if(data['status'] === "success"){
      history("/wishlist");
      window.location.reload(false);
    }
    console.log(data["status"]);
  }
  const history = useNavigate();
  return (
    <div className="container-center-horizontal">
      <form className="screen" onSubmit={e => buttonAction(e)}>
        <h1 className="input-label roboto-bold-black-36px">
          {action}:
        </h1>
        <Input id="email-input" type="email" outtext="Email:" intext="Email"/>
        <Input id="password-input" type="password" outtext="Password:" intext="Password" />
        <LoginButton
          text={action} className="button-primary"
        />
        {errorMessage}
      </form>
    </div>
  );
}

export default Login;

function Input(props) {
    const { id, outtext, intext, type} = props;
  
    return (
      <div className="input">
        <div className="email valign-text-middle inter-normal-trout-24px">
          {outtext}
        </div>
        <input id={id} type={type} data-form-type="action" required={true} className="text-field border-2px-iron email-1 inter-normal-black-24px" placeholder={intext}/>
      </div>
    );
  }

  function LoginButton(props) {
    const { text } = props;
  
    return (
      <button type="submit" className="btn btn-dark text-1 login-button valign-text-middle roboto-normal-white-18px">
            {text}
      </button>
    );
  }
