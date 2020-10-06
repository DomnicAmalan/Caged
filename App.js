/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  Image,
  View,
  ToastAndroid
} from 'react-native';
import SplashScreen from './screens/splashscreen';
import {MainApp} from './screens/Main'
import {Login } from './screens/Home/Login';
import NetInfo from "@react-native-community/netinfo";
import {Configuration} from './screens/Configuration';
import AsyncStorage from '@react-native-community/async-storage';
import {ConfigurationContext } from './screens/contexts/configurationContext'
 

const App: () => React$Node = () => {

  const [start, setStart] = useState(true);
  const [login, setLogin] = useState(null)
  const [isInternetConnected, setInternetConnected] = useState(false);
  const [configuration, setConfig] = useState({})

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setInternetConnected(state.isConnected);

      
    });
    getConfiguration();
    unsubscribe();
    console.log(isInternetConnected)

    setTimeout(() => {
      setStart(false)

    }, 3000)
  }, [isInternetConnected])

  const getConfiguration = async () => {
    try {

      // await AsyncStorage.removeItem('configs')
      const config = await AsyncStorage.getItem('configs')
      setConfig(JSON.parse(config))
    } catch (e) {
      // saving error
    }
  }

  return (
    <>
      <StatusBar backgroundColor='blue' barStyle="default" hidden translucent={true}/>
      <ConfigurationContext.Provider value={{ configuration, setConfig }}>
      {configuration ? 
        <>{!isInternetConnected ? <View style={{flex: 1, backgroundColor: "black", alignItems: "center", justifyContent: "center" }}><Image style={{width: 450, height: 700, resizeMode: "contain"}}  source={require('./screens/assets/noInternet.png')}/></View>:
        start ? <SplashScreen /> : <MainApp />}</> : <Configuration setConfig={setConfig} />}
      </ConfigurationContext.Provider>
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
