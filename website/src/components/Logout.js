import React, { useEffect } from 'react';
import apiLocation from './APILocation';
import './Logout.css'

function Logout(){
    useEffect(() => {
        LogoutUser()
    }, []);
    async function LogoutUser(){
        const response = await fetch(apiLocation + "logout", {
            method: 'GET',
            credentials: "include"
        });
        const data = await response.json();
        if(data['status'] === "logged out"){
            window.location.reload(false);
        }
    }
    return(
        <h1 className="logout-text roboto-bold-black-36px">
          Logged out!
        </h1>
    );
}

export default Logout