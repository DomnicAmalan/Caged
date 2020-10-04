import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert, SafeAreaView, LogBox, TouchableOpacity, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LANGUAGES} from './configs/languages';
import {COUNTRIES} from './configs/countries'
import SearchableDropdown from 'react-native-searchable-dropdown';
import StepIndicator from 'react-native-step-indicator';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const Configuration = ({setConfig}) => {
    
    const [language, setLanguage] = useState(null);
    const [country, setCountry] = useState(null);
    const [position, setPosition] = useState(0);
    const totalPOsition = 1
    const [currentError, setCurrentError] = useState(true);
    const storeData = async () => {
        if(!currentError){
            let value = {'language': language, country: country}
            try {
            await AsyncStorage.setItem('configs', JSON.stringify(value))
            setConfig(value);
            //   setComplete(true)
            } catch (e) {
            // saving error
            }
        }
        else{
            Alert.alert("Choose Lnaguage")
        }
       
    }
    useEffect(() => {
        let languageCheck = language !== null ? true : false
        let countryCheck = country!== null ? true: false
        setCurrentError(!languageCheck&&countryCheck)
    },[language, country])
    

    const renderLanguage = () => {
        const data = LANGUAGES.map(
            ({
                english_name,
                iso_639_1,
                
                name
            }) => 
            ({
                name: english_name,
                id: iso_639_1
            })
        )
        return data
    }

    const renderCountry = (rendertype) => {
        const data = COUNTRIES.map(
            ({
                english_name,
                iso_3166_1,
                
                name
            }) => 
            ({
                name: english_name,
                id: iso_3166_1
            })
        )
        return data
    }

    const labels = ["Choose Language","Choose Country"];
    const customStyles = {
        stepIndicatorSize: 20,
        currentStepIndicatorSize:20,
        separatorStrokeWidth: 3,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: '#7579e7',
        stepStrokeWidth: 3,
        stepStrokeFinishedColor: '#7579e7',
        stepStrokeUnFinishedColor: '#aaaaaa',
        separatorFinishedColor: '#590995',
        separatorUnFinishedColor: '#a3d8f4',
        stepIndicatorFinishedColor: '#b9fffc',
        stepIndicatorUnFinishedColor: '#b9fffc',
        stepIndicatorCurrentColor: '#ffffff',
        stepIndicatorLabelFontSize: 10,
        currentStepIndicatorLabelFontSize: 10,
        stepIndicatorLabelCurrentColor: 'black',
        stepIndicatorLabelFinishedColor: 'black',
        stepIndicatorLabelUnFinishedColor: '#aaaaaa',
        labelColor: 'white',
        labelSize: 10,
        currentStepLabelColor: 'white'
      }
    return(
        <View style={{flex: 1, backgroundColor: "black"}}>
                <View style={{ flex:1, backgroundColor: "black", maxHeight: 50}}>
                    <View style={{marginTop: 5, flex:1}}>
                        <StepIndicator
                            customStyles={customStyles}
                            currentPosition={position}
                            labels={labels}
                            stepCount={2}
                        />

                    </View>
                </View>
               
                <View style={{flex:1, backgroundColor: "black"}}>
                {position === 0 ?
                    <SearchableDropdown
                        onItemSelect={(item) => {
                            setLanguage(item)
                        }}
                        // selectedItems={language}
                        containerStyle={{ padding: 5, color: "black" }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 2,
                            // backgroundColor: '#ddd',
                            borderColor: '#bbb',
                            borderBottomWidth: 0.5,
                            borderRadius: 5,
                        }}
                        itemTextStyle={{ color: 'white', fontWeight: "bold" }}
                        itemsContainerStyle={{ }}
                        items={renderLanguage()}
                        defaultIndex={2}
                        resetValue={false}
                        placeholderTextColor={"white"}
                        textInputProps={
                            {
                            placeholder: "Choose Language",
                            underlineColorAndroid: "transparent",
                            style: {
                                padding: 12,
                                fontWeight: "bold",
                                color: "white"
                            },
                            }
                        } 
                    />: null}
                {position === 1 ? <SearchableDropdown
                    onItemSelect={(item, index) => {
                        setCountry(item)
                    }}
                    // selectedItems={language}
                    containerStyle={{ padding: 5, color: "black" }}
                    itemStyle={{
                        padding: 10,
                        marginTop: 2,
                        // backgroundColor: '#ddd',
                        borderColor: '#bbb',
                        borderBottomWidth: 0.5,
                        borderRadius: 5,
                    }}
                    itemTextStyle={{ color: 'white', fontWeight: "bold" }}
                    itemsContainerStyle={{ }}
                    items={renderCountry()}
                    defaultIndex={2}
                    resetValue={false}
                    placeholderTextColor={"white"}
                    textInputProps={
                        {
                        placeholder: "Choose Language",
                        underlineColorAndroid: "transparent",
                        style: {
                            padding: 12,
                            fontWeight: "bold",
                            color: "white"
                        },
                        }
                    } 
                />:null}
                
                <View style={{flex: 1, alignItems: "center", justifyContent:"center"}}>
                {!currentError && position >totalPOsition ? 
                    <Text style={{color: "white", alignSelf: "center", fontSize: 25, fontWeight: "bold"}}>Setup complete</Text>:currentError && position >totalPOsition ?
                    <Text style={{color: "red", alignSelf: "center", fontSize: 25, fontWeight: "bold"}}>Please Correct the error to continue</Text> : null}
                    </View>
                
                </View>
                
                <View style={{flex:1, backgroundColor: "black", maxHeight:200, alignItems: "center", marginHorizontal: 20, flexDirection:"row", justifyContent:"center"}}>
                    {position >= 1 ? <View style={{flex: 1,backgroundColor: "black", justifyContent: "center", alignItems: "flex-start"}} >
                        <TouchableOpacity onPress={() => setPosition(position-1)} style={{backgroundColor: "grey", alignItems: "center", justifyContent: "center", borderRadius: 20}}>
                                <Text style={{color: "white", marginHorizontal: 10}}>Previous</Text>
                            </TouchableOpacity>
                    </View>:null}
                    <View style={{flex: 1, backgroundColor: "black", justifyContent: "center", alignItems: "flex-end" }}>
                        {position > totalPOsition ? 
                            <TouchableOpacity onPress={() => storeData()} style={{backgroundColor: "grey", alignItems: "center", justifyContent: "center", borderRadius: 20}}>
                                <Text style={{color: "white", marginHorizontal: 10}}>Finish</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity onPress={() => setPosition(position+1)} style={{backgroundColor: "grey", alignItems: "center", justifyContent: "center", borderRadius: 20}}>
                                <Text style={{color: "white", marginHorizontal: 10}}>Next</Text>
                        </TouchableOpacity>} 
                    </View>          
                </View>
                
        </View>
    )
}

const styles= StyleSheet.create({
    nextButton: {
        color: "red"
    },
    
})

export {Configuration}