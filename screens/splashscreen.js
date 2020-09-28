import React, {useEffect} from 'react';
import {Animated, StyleSheet, View, Text} from 'react-native';

const SplashScreen = () => {

    const fadeIn = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
        }).start();
    }, [])

    return(
        <>
            <View style={styles.container}>
                <Animated.Text style={[styles.text, {opacity: fadeIn.interpolate({inputRange: [0, 1],outputRange: [0, 1], extrapolate: 'clamp'})}]}>
                    caged
                </Animated.Text>
                <View style={styles.subheader}>
                    <Animated.Text style={[styles.text, {opacity: fadeIn.interpolate({inputRange: [0, 1],outputRange: [0, 1], extrapolate: 'clamp'}), textDecorationLine: "underline", fontSize:10}]}>
                        UNLEASH THE MOVIES
                    </Animated.Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "Roboto-Regular", 
        color: "#FB5558", 
        fontSize: 40,
        letterSpacing: 10,
        writingDirection: "ltr",
        textAlign: "center"
    },
    container: {flex: 1, justifyContent: "center" },
    subheader: {
        marginTop: 10
    }
})

export default SplashScreen;
