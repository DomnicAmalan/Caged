import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { Login } from './Home/Login'
import { Home } from './Index';
import {LoginContext} from './contexts/LoginContext';
 
const MainApp = () => {
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [requestToken, setRequestToken] = useState(null);
   
    return(
     <>
         <LoginContext.Provider value={{ setLoggedIn, setRequestToken, requestToken }}>
            {isLoggedIn ?
                <Home/>: 
                <Login  />
            }
        </LoginContext.Provider>
     </>   
    )
}

export  { MainApp }