import './App.css';
import ButtonPrimary from './ButtonPrimary';

import React from 'react';

function HomeContent() {
  return (
    <div className="hero-side-image-right">
      <div className="content">
        <h1 className="title">
          Find the best deals on products you want
        </h1>
        <div className="subtitle">
          Scan through multiple sites for the best deal on what you want
        </div>
        <ButtonPrimary className="button-large" text="Sign up now" link="/signup"/>
      </div>
      <Browser/>
    </div>
  );
}


function Browser() {
  return (
    <div className="browser border-1px-black">
      <div className="button-1 border-1px-black"></div>
      <div className="button border-1px-black"></div>
      <div className="button border-1px-black"></div>
    </div>
  );
}

export default HomeContent;