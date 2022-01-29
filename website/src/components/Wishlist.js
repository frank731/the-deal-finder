import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router'
import SubmitButton from './SubmitButton';
import CheckLogin from './CheckLogin';
import './Login.css'
import  './Wishlist.css'
const { v4: uuidv4 } = require('uuid');

function Wishlist() {

  useEffect(() => {
    CheckLogin(history);
    setCurScraping(false);
    GetUserWishlist();
  }, []);

  function CreateItem(){
    setItems([...items, {itemName: "New item", itemID: uuidv4(), editable: "false"}]);
  }

  function DeleteItem(itemID){
    const remainingItems = items.filter(item => itemID !== item.itemID);
    setItems(remainingItems);
  }

  function EditItem(itemID, on){
    // Create copy of items
    var newItems = [...items];
    // Set item with specified itemID editable to true
    Object.assign(newItems.find(item => itemID === item.itemID), {"editable": on});
    setItems(newItems);
  }

  function ChangeItem(itemID, newName){
    // Create copy of items
    var newItems = [...items];
    // Set item with specified itemID editable to true
    Object.assign(newItems.find(item => itemID === item.itemID), {"itemName": newName});
    setItems(newItems);
  }

  function StopEdit(e, itemID){
    // Check  if input is enter key
    if(e.key === "Enter"){
      //Stops default new line
      if (e.preventDefault) {
        e.preventDefault(); 
      } else {
          e.returnValue = false;
      }
      // Disable item
      EditItem(itemID, "false");
      ChangeItem(itemID, e.target.innerHTML)
      fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/update-wishlist", {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        // Get only a list of the item names
        body: JSON.stringify({ items: items.map(item => item.itemName) })
      })
    }
    //
  }

  async function StartScrape(){
    setCurScraping(true);
    const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/scrape", {
      method: 'POST',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      // Get only a list of the item names
      body: JSON.stringify({ items: items.map(item => item.itemName) })
    })
    
    const data = await response.json();
    history('/results', 
    {state: data});
  }

  async function GetUserWishlist(){
    const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/get-wishlist", {
      method: 'GET',
      credentials: "include"
    })
    const data = await response.json();
    setItems(data['items'].map(item => Object.assign({itemName: item, itemID: uuidv4(), editable: "false"})));
  }

  const history = useNavigate();
  const WISH_DATA = [];//{itemName: "test", itemID: "2"}];
  const [items, setItems] = useState(WISH_DATA);
  const [curScraping, setCurScraping] = useState(false);
  console.log(curScraping)
  const rendered_items = (!curScraping) ? items.map(item => (<Item itemName={item.itemName} itemID={item.itemID} key={item.itemID} editItem={EditItem} deleteItem={DeleteItem} stopEdit={StopEdit} editable={item.editable}/>)) : <div/>;
  const scrape_text = (curScraping) ?  <ScrapingText time={items.length * 15}/>: <div/>
  const action_buttons = (!curScraping) ?  [<SubmitButton func={CreateItem} text="Add Item"/>, <SubmitButton func={StartScrape} text="Start Scraper"/>] : <div/>
  return (
    <div className="container-center-horizontal clearfix">
      <div className="screen clearfix">
        <h1 className="input-label roboto-bold-black-36px">
          Wishlist:
        </h1>
        <div className="flex-row">
        {scrape_text}
          <div id="item-grid" className="grid-container">
            {rendered_items}
          </div>
        </div>
        {action_buttons}
      </div>
    </div>
  );
}

export default Wishlist;

function Item(props) {
    const { itemName, itemID, editItem, deleteItem, stopEdit, editable } = props;
    return (
      <div className="item">
        <div className="item-container">
          <div onKeyDown={e => stopEdit(e, itemID)} contentEditable={editable} className="item-name roboto-normal-black-20px">
            {itemName}
          </div>
          <button onClick={() => editItem(itemID, "true")} className="btn btn-link item-action roboto-normal-black-14px">
            Edit Item
          </button>
          <button onClick={() => deleteItem(itemID)} className="btn btn-link item-action roboto-normal-black-14px">
            Delete Item
          </button>
        </div>
      </div>
    );
  }



  function ScrapingText(props){
    const {time} = props
    return(
    <div className='mx-auto'>
      <div className='scraping-text col-md-8 offset-md-2'>
        <h1 className='scrape-label roboto-normal-black-36px' >Scraping</h1>
        <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      </div>
      <h1 className='scrape-label roboto-normal-black-36px' >Estimated time: {time}s</h1>
    </div>
    );
  }
