import React, { useContext, useEffect, useState } from 'react'
import {View, Text, FlatList, TouchableOpacity, Image, StatusBar} from 'react-native'
import { getMovies } from '../apis/api';
import Icon from 'react-native-vector-icons/Ionicons';
import * as HomeNavigation from '../Navigators/Homenavigations';
import { ConfigurationContext } from '../contexts/configurationContext';
import {Banner, NativeAds} from '../ADS/index'


const TV = () => {
    const [page, setPage] = useState(1);
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
            <TouchableOpacity style={{flex:1}} onPress={() => HomeNavigation.navigate('tvpreview', {id: item.key})} 
                    style={{flex:1,alignItems:"center", justifyContent:"center",
                    aspectRatio:1, marginVertical: 20, elevation:10}}>
                    {item.poster !== null ?
                        <Image style={{ height:150, width:100, borderRadius:20 }} resizeMode='contain' source={{ uri: item.poster}}></Image>
                        : 
                         <Text style={{color: "white", fontWeight:"bold", fontSize:12, paddingHorizontal:20}}>{item.title}</Text>
                    }
                    
            </TouchableOpacity>
        )
    }

    return(
        <View style={{flex: 1, justifyContent: "center", backgroundColor: "black"}}>
            <StatusBar hidden />
            <View style={{flex: 1, flexDirection:"row",maxHeight: 30}}>
                <View style={{flex:1,alignItems:"center", justifyContent: "center"}}>
                    <Text style={{color: "white", fontSize: 20, alignSelf:"center", fontWeight:"bold"}}>TV</Text>
                </View>
                <TouchableOpacity style={{justifyContent:"center", marginRight:10}} onPress={() => HomeNavigation.navigate('search', {from: 'tv'})}>
                    <Icon name="search" size={25} color={"red"}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1}}>
                <FlatList
                    numColumns={3}
                    data={tvList}
                    renderItem={({ item }) => renderItem(item)}
                    onEndReached={() => onNextPage()}
                    onEndReachedThreshold={10}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{flex:1 ,maxHeight: 80}}>
                <NativeAds />
            </View>
        </View>
    )
}

export { TV }