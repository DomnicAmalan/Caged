import React, { useState, useContext, useEffect } from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity,  Modal, Alert} from 'react-native';
import Axios from 'react-native-axios';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient'
import WebView  from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons'
import InAppBrowser from 'react-native-inappbrowser-reborn';
import {API_KEY, ACCESS_TOKEN} from '../configs/tmdb'
import { LoginContext } from '../contexts/LoginContext';
const Trakt = require('nodeless-trakt');


const Login = () => {
    const [webScreen, setWebscreen] = useState(false);
    const [code, setCode] = useState(null);
    const { requestToken, setLoggedIn, setRequestToken } = useContext(LoginContext);

    const getRequestToken = async() => {
        const headers = {"content-type": "application/json;charset=utf-8", "authorization": `Bearer ${ACCESS_TOKEN}`}

        try{
            const res = await Axios.post('https://api.themoviedb.org/4/auth/request_token', null, {headers: headers})
            setRequestToken(res.data.request_token)
            setWebscreen(true)
            setTempUser(res.data.request_token)
        }
        catch(e){
            console.log(e)
        }
    }

    
    useEffect(() => {
        // Tr()
    },[webScreen])

    const Tr = async() => {

        const trakt = await new Trakt({
            client_id: "2bf34c449c0af1c4f1cb748b5318facbc3bbb1578798d33b562a95db296afbd4",
            client_secret: "48078fb7bcd6b1e03c18fb4522d599d253e775d5d9dcf33c733faf9f0be3f514",
            redirect_uri: null,   // defaults to 'urn:ietf:wg:oauth:2.0:oob'
            api_url: null         // defaults to 'https://api.trakt.tv'
        })
            
        try{
            try{
                const polling = trakt.get_codes().then((poll) => {
                    setCode(poll.user_code)
                    return trakt.poll_access(poll)
                });
            }
            catch(e){
                console.log(e)
            }
        }
        catch(e){
            console.log(e)
        }
        
    }
    
    

    const navigationChange = (webViewState) => {
        if(webViewState.url === 'https://trakt.tv/activate/authorize'){
            setWebscreen(false)
            setLoggedIn(true)
        }
    }

    return(
        <View style={styles.container}>
            <Image source={require('../assets/tmdb.png')} style={styles.logo} />
            <LinearGradient start={{x: 1, y: 0}} 
                    colors={['#0d253f', '#01b4e4', '#90cea1' ]}
                    style={styles.button}
                >
                <TouchableOpacity style={styles.button} onPress={() => getRequestToken()}>
                            <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent: "center"
    },
    logo:{
        width: 100,
        height: 100,
        resizeMode: "contain",
        alignSelf: "center",
    },
    button: {
        width: 200,height:60,
        borderRadius: 30,
        justifyContent: "center",
        alignSelf: "center"
    },
    buttonText: {
        alignSelf: "center",
        color: "#0d253f",
        fontWeight: "bold",
        fontSize: 15
    }
})

export {Login}