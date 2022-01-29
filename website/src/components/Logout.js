import React, { useEffect } from 'react';
import './Logout.css'

function Logout(){
    useEffect(() => {
        LogoutUser()
    }, []);
    async function LogoutUser(){
        const response = await fetch("https://the-deal-finder-api.canadaeast.cloudapp.azure.com:5000/logout", {
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