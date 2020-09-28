import React, { useContext } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MoviesTab, TV, HomePage, MoviePreview } from './Home/Index';
import Icon from 'react-native-vector-icons/Ionicons'
import * as HomeNavigation from './Navigators/Homenavigations';
import {LoginContext} from './contexts/LoginContext'


const HomeStack = createStackNavigator();



const Home = () => {
    const {requestToken} = useContext(LoginContext);

    return(
        <View style={{flex:1}}>
            <NavigationContainer ref={HomeNavigation.homeNavRef}>
                <HomeStack.Navigator headerMode="none" gestureEnabled={true} navigationOptions={{ gestureDirection: "horizontal", }}>
                    <HomeStack.Screen name="home" component={ HomePage } />
                    <HomeStack.Screen name="movies" component={ MoviesTab } />
                    <HomeStack.Screen name="tv" component={ TV } />
                    <HomeStack.Screen name="moviepreview" component={ MoviePreview }/>
                </HomeStack.Navigator>
                <View style={styles.topTab}>
                    <TouchableOpacity onPress={() => HomeNavigation.navigate('home')}>
                        <Icon name="home" size={20} color={"#363636"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => HomeNavigation.navigate('movies')}>
                        <Icon name="film-outline" size={20} color={"#77C8B2"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => HomeNavigation.navigate('tv')}>
                        <Icon name="desktop-outline" size={20} color={"#FFC145"}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Icon name="search" size={20} color={"#FB5558"}/>
                    </TouchableOpacity>
                </View>
            </NavigationContainer>
        </View> 
    )
}

const styles = StyleSheet.create({
    topTab: {
        height: "auto", 
        paddingVertical: 10,
        flexDirection: "row",
        alignContent: "space-between",
        justifyContent: "space-around",
        bottom: 0,
        width: "100%",
        borderTopColor: "#363636",
        borderTopWidth: 0.2,
        elevation: 0.3,
        backgroundColor: "black"
    },
    tabMenu: {
        fontFamily: "AvenirNextLTPro-Bold",
        fontSize: 10,
        color: "black",
        fontWeight: "bold"
    }
})


export { Home }