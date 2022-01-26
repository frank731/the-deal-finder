import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import HomeContent from './HomeContent';
import Header from './Header';
import Login from './Login'
import SignUp from './SignUp';
import Wishlist from './Wishlist';
import Results from './Results';
import Logout from './Logout';
import {BrowserRouter, Routes, Route} from 'react-router-dom';


function App(){
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                <Route exact path='/' element={<HomeContent/>}/>
                <Route path='login' element={<Login action="Log in" func="login"/>}/>
                <Route path='signup' element={<SignUp/>}/>
                <Route path='wishlist' element={<Wishlist/>}/>
                <Route path='results' element={<Results/>}/>
                <Route path='logout' element={<Logout/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;