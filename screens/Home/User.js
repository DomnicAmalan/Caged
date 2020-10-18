import React, { useEffect } from 'react';
import { Text } from 'react-native';
import {ConfigurationContext} from '../contexts/configurationContext';
import AsyncStorage from '@react-native-community/async-storage';


const User = () => {
    const { configuration, setConfig } = React.useContext(ConfigurationContext);
    useEffect(() => {
        setCo()
        // let tempconfig = {...configuration}
        // // console
        // tempconfig.language.id="ta"
        // setConfig(configuration)
    }, [])
    const setCo = async() => {
        let value = {"country": {"id": "IN", "name": "India"}, "language": {"id": "ta", "name": "Tamil"}}

        try {
            await AsyncStorage.setItem('configs', JSON.stringify(value))
            setConfig(value);
        //   setComplete(true)
        } catch (e) {
        // saving error
        }

    }

    return(
        <>
            <Text>User</Text>
        </>
    )
}

export {User}