import React from 'react';
import {View, Text, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LANGUAGES} from './configs/languages'
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';

const Configuration = ({setConfig}) => {
    
    const storeData = async (value) => {
        try {
          await AsyncStorage.setItem('movieLanguage', JSON.stringify(value))
          setConfig(value)
        } catch (e) {
          // saving error
        }
      }

    const renderData = () => {
        const data = LANGUAGES.map(
            ({
                english_name,
                iso_639_1,
                name
            }) => 
            ({
                label: english_name,
                value: iso_639_1
            })
        )
        return data
    }

    return(
        <>
            <Text>Configuration</Text>
            <DropDownPicker
                items={renderData()}
                searchable={true}
                // defaultValue={this.state.country}
                containerStyle={{height: 40}}
                style={{backgroundColor: '#fafafa'}}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{backgroundColor: '#fafafa'}}
                onChangeItem={item=>storeData(item)}
            />
        </>
    )
}
export {Configuration}