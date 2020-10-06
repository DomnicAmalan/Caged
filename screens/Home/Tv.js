import React, { useContext, useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, Image, StatusBar} from 'react-native'
import { Axios } from 'react-native-axios/lib/axios';
import { getMovies } from '../apis/api';
import Icon from 'react-native-vector-icons/Ionicons';
import Rating from './Rating';
import * as HomeNavigation from '../Navigators/Homenavigations';
import { ConfigurationContext } from '../contexts/configurationContext'


const TV = () => {
    const [page, setPage] = useState(3);
    const [tvList, setTvList] = useState([]);
    const { configuration } = useContext(ConfigurationContext)
    

    useEffect(() => {
        paginatedData()
    }, [])

    const paginatedData = async() => {
       const data = await getMovies(page, configuration.language.id, 'tv')
       setTvList(data)
    }

    const onNextPage = async() => {
        try{
            const data = await getMovies(page + 1, configuration.language.id, 'tv')
            setTvList([...tvList, ...data])
            setPage(page+1)
        }
        catch(e){
            console.log("failed")
        }
        
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity onPress={() => HomeNavigation.navigate('tvpreview', {id: item.key})} 
                     style={{flex:1,alignSelf: "center",//here you can use flex:1 also
                     aspectRatio:1, marginVertical: 20, elevation:10}}>
                    <View style={{flex:1, alignItems: "center", justifyContent: "center"}}>
                        <Image style={{ height:150, width:100 }}  resizeMode='contain' source={{ uri: item.poster}}></Image>
                    </View>
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex: 1, justifyContent: "center", backgroundColor: "black"}}>
            <StatusBar hidden />
            <View style={{textAlign: "center", margin: 5, alignSelf: "center", flexDirection: "row", width: "100%", textAlign: "center"}}>
                <Text style={{color: "white", alignSelf: "center"}}>TV</Text>
                <View style={{alignSelf: "flex-end"}}>
                    <Icon name="search" size={25} color={"red"}/>
                </View>
            </View>
            <FlatList
                numColumns={3}
                data={tvList}
                renderItem={({ item }) => renderItem(item)}
                onEndReached={() => onNextPage()}
                onEndReachedThreshold={10}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    )
}

export { TV }