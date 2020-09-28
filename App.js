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
  StatusBar
} from 'react-native';
import SplashScreen from './screens/splashscreen';
import {MainApp} from './screens/Main'
import {Login } from './screens/Home/Login'


const App: () => React$Node = () => {

  const [start, setStart] = useState(true);
  const [login, setLogin] = useState(null)

  useEffect(() => {
    setTimeout(() => {
      setStart(false)
    }, 3000)
  }, [])

  return (
    <>
      <StatusBar backgroundColor='blue' barStyle="default" hidden translucent={true}/>
      {start ? <SplashScreen /> : <MainApp />}
    </>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
