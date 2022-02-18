import React, {useEffect, useState} from 'react';
import ButtonPrimary from './ButtonPrimary';
import {useLocation} from 'react-router'
import './Login.css'
import './Results.css'
import  './Wishlist.css'

const NAME_INDEX = 0;
const PRICE_INDEX = 1;
const RATING_INDEX = 2;
const IMAGE_INDEX = 3;
const LINK_INDEX = 4;

function Results() {
  
  const location = useLocation();
  var results = []
  for (const wantedName in location.state['results']){
    if(location.state['results'].hasOwnProperty(wantedName)){
      const item = location.state['results'][wantedName];
      results.push(<Result key={item[NAME_INDEX]} wantedName={wantedName} itemName={item[NAME_INDEX]} itemPrice={item[PRICE_INDEX]} 
        itemRating={item[RATING_INDEX]} itemLink={item[LINK_INDEX]} itemImage={item[IMAGE_INDEX]}/>);
    }
  }
  return (
    <div className="container-center-horizontal">
      <div className="screen">
        <h1 className="input-label roboto-bold-black-36px">
          The Best Deals:
        </h1>
        <div className="result-row">
          <div>
            {results}
          </div>
        </div>
      <ButtonPrimary link="/wishlist" text="Back to wishlist" className="btn-dark text-1 login-button submit-button valign-text-middle roboto-normal-white-18px"/>
      </div>
    </div>
  );
}

export default Results;

function Result(props) {
    const { wantedName, itemName, itemPrice, itemRating, itemLink, itemImage} = props;
    return (
      <div className="result">
        <div className="result-name roboto-bold-black-24px">
            {wantedName}
        </div>
        <div className="result-container">
          <div className="result-name roboto-bold-black-24px">
            {itemName}
          </div>
          <div className="item-action roboto-normal-black-18px">
            ${itemPrice}
          </div>
          <div className="item-action roboto-normal-black-18px">
            {itemRating}/5⭐
          </div>
          
        </div>
        <img alt={itemName} className="result-image" src={itemImage}/>
        <ButtonPrimary link={itemLink} text="Link to buy" className="btn-dark text-1 login-button submit-button valign-text-middle roboto-normal-white-18px"/>
      </div>
    );
  }