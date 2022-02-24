import React, { useEffect, useState } from 'react';
import "./App.css"
import ButtonPrimary from './ButtonPrimary';
import apiLocation from './APILocation';

function Header() {
  useEffect(() => {
    async function CheckLogin(){
      const response = await fetch(apiLocation + "check-login", {
        method: 'GET',
        credentials: "include"
      })
      const data = await response.json();
      
      if(data['result'] == 'not logged in'){
        setLinks(<a className="nav-link" href="/login">Log In</a>);
        setSignUpButton(<ButtonPrimary text="Sign Up" className="button-primary" link="/signup"></ButtonPrimary>)
        setSignedInEmail();
      }
      else{
        setLinks(<a className="nav-link" href="/wishlist">Wishlist</a>)
        setSignUpButton(<ButtonPrimary text="Log Out" className="button-primary" link="/logout"></ButtonPrimary>)
        setSignedInEmail(<h3 className="logged-in-label">Logged in as {data['result']}</h3>)
      }
    }
    CheckLogin();
  }, []);
  const [links, setLinks] = useState();
  const [signupButton, setSignUpButton] = useState();
  const [signedInEmail, setSignedInEmail] = useState();
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
    {signedInEmail}
    {signupButton}
    </nav>
  );
}

export default Header;
