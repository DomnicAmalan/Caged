import { Picker } from '@react-native-community/picker';
import React, { useEffect, useState,  } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, Image, Animated, Block, TextInput, View, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { colors, sizes, fonts } from '../configs/theme';
import useDebounce from './Debounce';
import {searchItem, getImagePath} from '../apis/api'
import { FlatList, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import * as HomeNavigation from '../Navigators/Homenavigations';
import {Banner, NativeAds} from '../ADS/index'

const { width, height } = Dimensions.get("window");
const Search = ({route}) => {
    const from = route.params.from
    
    const [searchString, setsearchString] = useState(null);
    const [currentSearch, setCurrentSearch] = useState(from);
    const [isSearching, setSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const debouncedSearchTerm = useDebounce(searchString, 1500);
    
    useEffect(() => {
      // setCurrentSearch(from);
      if (debouncedSearchTerm) {
        setSearching(true);
        searchData();
      } else {
        setSearchResults([]);
      }
    }, [debouncedSearchTerm, currentSearch])

    const searchData  = async() => {
      const {results, total_pages} = await searchItem(1,currentSearch, debouncedSearchTerm);
      let tempResults = results.filter(type =>   { return type.media_type !== 'person'  })
      setSearchResults(tempResults)
      setSearching(false)
    } 

    const navigator = (item) => {
      if(currentSearch === 'multi'){
        if(item.media_type == 'movie' ){
          return 'moviepreview'
        }
        else if(item.media_type == 'tv'){
          return 'tvpreview'
        }
      }
      else{
        if(currentSearch === 'movie'){
          return 'moviepreview'
        }
        else if(item.media_type == 'tv'){
          return 'tvpreview'
        }
      }
    }
    

    const renderItem = (item,index) => {
      return(
        <TouchableOpacity style={{flex:1, marginVertical:15, alignItems:"center", textAlign:"center", }} onPress={() => HomeNavigation.navigate(navigator(item), {id:item.id})}>
              {item.poster_path !== null ? 
                <Image style={{ height:150, width:100, borderRadius:20 }}  resizeMode='contain' source={{uri:getImagePath(item.poster_path)}}/>
              : <Text style={{flex:1, color: "white", paddingHorizontal: 20, fontWeight:"bold", fontSize:12}}>{item.original_name ? item.original_name : item.original_title}</Text>}
        </TouchableOpacity>
      )
    }

    return(
     
        <View style={{flex:1, backgroundColor:"black"}}>
           
            <View style={{flex: 1,justifyContent: 'flex-end'}}>
                <View style={{flex:1, justifyContent: "flex-end",}}>
                  {isSearching ?
                      <Text style={{flex:1, color: "white", fontSize:40, fontWeight:"bold", alignSelf:"center"}}>Searching...</Text>
                    : 
                    <View style={{flex:1}}>
                      {searchResults.length ? 
                      <ScrollView style={{flex:1}}>
                          <FlatList
                              numColumns={3}
                              data={searchResults}
                              renderItem={({ item, index }) => renderItem(item, index)}
                              style={{flexDirection: "column-reverse"}}
                              keyExtractor={(item, index) => index.toString()}
                              enableEmptySections={false}
                          />
                      </ScrollView>: 
                      <View style={{flex:1, maxHeight:50, maxWidth:"100%", alignItems:"center", marginTop: 10}}>
                          <Text style={{flex:1, color: "white", fontSize:40, fontWeight:"bold", alignSelf:"center"}}>No Resuts</Text>
                      </View>
                      }
                    </View>
                  }
                </View>
              <View style={{flex:1, maxHeight:80,marginTop: 10}}>
                  <NativeAds />
              </View>
              <TextInput onChangeText={(text) => setsearchString(text)} placeholder={"Search"} placeholderTextColor={"grey"} style={{color:"white", textAlign:"left", textAlignVertical:"center", fontSize:10,fontWeight:"bold", backgroundColor: "rgba(142, 142, 147, 0.06)", width:"100%", maxHeight: 35, borderRadius: 8, width:"100%"}}/>
              <View style={{flex:1, bottom:5, alignSelf:"flex-end",alignItems:"center", position:"absolute", backgroundColor:"white", width:100, maxHeight:35, backgroundColor:"black"}}>
                  <View style={{flex:1, justifyContent:"space-between", flexDirection:"row", alignItems:"center"}}>
                    <TouchableHighlight style={{flex:1, marginHorizontal:5, borderWidth:1, borderRadius:4, borderColor:currentSearch == 'multi' ? "white":"rgb(128,128,128)"}} onPress={() => setCurrentSearch('multi')}>
                      <Text style={{color:currentSearch == 'multi' ? "white":"grey", fontSize: 8, margin:2, fontWeight:"bold"}}>All</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1, marginHorizontal:5, borderWidth:1,borderRadius:4, borderColor:currentSearch == 'movie' ? "white":"rgb(128,128,128)"}} onPress={() => setCurrentSearch('movie')}>
                      <Text style={{color:currentSearch == 'movie' ? "white":"grey", fontSize: 8, margin:2, fontWeight:"bold"}}>Movie</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{flex:1, marginHorizontal:5, borderWidth:1,borderRadius:4, borderColor:currentSearch == 'tv' ? "white":"rgb(128,128,128)"}} onPress={() => setCurrentSearch('tv')}>
                      <Text style={{color:currentSearch == 'tv' ? "white":"grey", fontSize: 8, margin:2, fontWeight:"bold"}}>Tv</Text>
                    </TouchableHighlight>
                  </View>
              </View>
            </View>
        </View>
      )
}

const styles = StyleSheet.create({
  
})

export {Search};