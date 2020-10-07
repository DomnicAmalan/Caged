import React, { useContext, useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, Image, StatusBar} from 'react-native'
import { Axios } from 'react-native-axios/lib/axios';
import { getMovies } from '../apis/api';
import Icon from 'react-native-vector-icons/Ionicons';
import Rating from './Rating';
import * as HomeNavigation from '../Navigators/Homenavigations';
import { ConfigurationContext } from '../contexts/configurationContext'


const MoviesTab = () => {
    const [page, setPage] = useState(3);
    const [moviesList, setMoviesList] = useState([]);
    const { configuration } = useContext(ConfigurationContext)
    

    useEffect(() => {
        paginatedData()
    }, [])

    const paginatedData = async() => {
       const data = await getMovies(page, configuration.language.id, 'movie')
       setMoviesList(data)
    }

    const onNextPage = async() => {
        try{
            const data = await getMovies(page + 1, configuration.language.id, 'movie')
            setMoviesList([...moviesList, ...data])
            setPage(page+1)
        }
        catch(e){
            console.log("failed")
        }
        
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={{flex:1}} onPress={() => HomeNavigation.navigate('moviepreview', {id: item.key})} 
                     style={{flex:1,alignSelf: "center",//here you can use flex:1 also
                     aspectRatio:1, marginVertical: 20, elevation:10}}>
                    <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                    <Image style={{ height:150, width:100, borderRadius:20 }} accessibilityLabel={"alt"} resizeMode='contain' source={{ uri: item.poster}}></Image>
                    </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex: 1, justifyContent: "center", backgroundColor: "black"}}>
            <StatusBar hidden />
            <View style={{flex: 1, flexDirection:"row",maxHeight: 30}}>
                <View style={{flex:1,alignItems:"center", justifyContent: "center"}}>
                    <Text style={{color: "white", fontSize: 20, alignSelf:"center", fontWeight:"bold"}}>Movies</Text>
                </View>
                <TouchableOpacity style={{justifyContent:"center", marginRight:10}} onPress={() => HomeNavigation.navigate('search', {from: 'movie'})}>
                    <Icon name="search" size={25} color={"red"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    numColumns={3}
                    data={moviesList}
                    renderItem={({ item }) => renderItem(item)}
                    onEndReached={() => onNextPage()}
                    onEndReachedThreshold={10}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            
        </View>
    )
}

export { MoviesTab }