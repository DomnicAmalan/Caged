import React, { useState } from 'react';
import {View, Text, StyleSheet, Alert, SafeAreaView, LogBox, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {LANGUAGES} from './configs/languages'
import SearchableDropdown from 'react-native-searchable-dropdown';
import StepIndicator from 'react-native-step-indicator';
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

const Configuration = ({setConfig}) => {
    
    const [language, setLanguage] = useState(null);
    const [country, setCountry] = useState(null);
    const [position, setPosition] = useState(0);
    const totalPOsition = 1
    
    const storeData = async () => {
        let value = {'language': language, country: country}
        try {
          await AsyncStorage.setItem('configs', JSON.stringify(value))
          setConfig(value);
        //   setComplete(true)
        } catch (e) {
          // saving error
        }
    }


    const renderData = (rendertype) => {
        const data = rendertype.map(
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
        stepIndicatorLabelCurrentColor: 'white',
        stepIndicatorLabelFinishedColor: 'white',
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
                    <SearchableDropdown
                        onItemSelect={(item, index) => {
                            console.log(item, index)
                            // setLanguage(item)
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
                        items={renderData(LANGUAGES)}
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
                    />
                </View>
                
                <View style={{flex:1, backgroundColor: "black", maxHeight:200, alignItems: "flex-end", marginHorizontal: 20}}>
                    {position === totalPOsition ? 
                        <TouchableOpacity onPress={() => storeData()} style={{width: 50, backgroundColor: "grey", alignItems: "center", justifyContent: "center", borderRadius: 20}}>
                            <Text style={{color: "white"}}>Finish</Text>
                        </TouchableOpacity> :
                        <TouchableOpacity onPress={() => setPosition(position+1)} style={{width: 50, backgroundColor: "grey", alignItems: "center", justifyContent: "center", borderRadius: 20}}>
                            <Text style={{color: "white"}}>Next</Text>
                    </TouchableOpacity>   }                 
                </View>
                
                {/* <ProgressSteps isComplete={complete}>
                    <ProgressStep label="Choose Language" nextBtnTextStyle={styles.nextButton} >
                        <SearchableDropdown
                            onItemSelect={(item, index) => {
                                console.log(item, index)
                                // setLanguage(item)
                            }}
                            // selectedItems={language}
                            containerStyle={{ padding: 5, color: "white" }}
                            itemStyle={{
                                padding: 10,
                                marginTop: 2,
                                // backgroundColor: '#ddd',
                                borderColor: '#bbb',
                                borderBottomWidth: 0.5,
                                borderRadius: 5,
                            }}
                            itemTextStyle={{ color: 'black', fontWeight: "bold" }}
                            itemsContainerStyle={{ maxHeight: 100 }}
                            items={renderData(LANGUAGES)}
                            defaultIndex={2}
                            resetValue={false}
                            textInputProps={
                                {
                                placeholder: "Choose Language",
                                underlineColorAndroid: "transparent",
                                style: {
                                    padding: 12,
                                    fontWeight: "bold"
                                },
                                //   onTextChange: text => alert(text)
                                }
                            }
                            
                        />
                    </ProgressStep>


                    <ProgressStep label="Choose Country" onSubmit={() => storeData()}>
                        <SearchableDropdown
                                onItemSelect={item => console.log(item)}
                                containerStyle={{ padding: 5, color: "white" }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    // backgroundColor: '#ddd',
                                    borderColor: '#bbb',
                                    borderBottomWidth: 0.5,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: 'black' }}
                                itemsContainerStyle={{ maxHeight: 100 }}
                                items={renderData(COUNTRIES)}
                                defaultIndex={1}
                                resetValue={false}
                                textInputProps={
                                    {
                                    placeholder: "Choose Country",
                                    underlineColorAndroid: "transparent",
                                    style: {
                                        padding: 12,
                                        
                                    },
                                    //   onTextChange: text => alert(text)
                                    }
                                }
                                
                            />
                        </ProgressStep>

                </ProgressSteps> */}
                
        </View>
    )
}

const styles= StyleSheet.create({
    nextButton: {
        color: "red"
    },
    
})

export {Configuration}