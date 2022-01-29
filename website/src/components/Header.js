import React, { useEffect, useState } from 'react';
import "./App.css"
import ButtonPrimary from './ButtonPrimary';

function Header() {
  useEffect(() => {
    async function CheckLogin(){
      const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/check-login", {
        method: 'GET',
        credentials: "include"
      })
      const data = await response.json();
      
      if(data['result'] == 'not logged in'){
        setLinks(<a className="nav-link" href="/login">Log In</a>);
        setSignUpButton(<ButtonPrimary text="Sign Up" className="button-primary" link="/signup"></ButtonPrimary>)
      }
      else{
        setLinks(<a className="nav-link" href="/wishlist">Wishlist</a>)
        setSignUpButton(<ButtonPrimary text="Log Out" className="button-primary" link="/logout"></ButtonPrimary>)
      }
    }
    CheckLogin();
  }, []);
  const [links, setLinks] = useState();
  const [signupButton, setSignUpButton] = useState();
  return (
    <nav className="navbar navbar-expand-lg navbar-light navigation-left">
      <h1 className="navbar-brand mb-0 logo">
        THE DEAL FINDER
      </h1>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className="nav-link "href="/">Home</a>
          {links}
      </div>
    </div>
    {signupButton}
    </nav>
  );
}

export default Header;
