import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import {getMovieById, getVideos, getImages} from '../apis/api';
import ytdl from "react-native-ytdl"
import VideoPlayer from 'react-native-video-player';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as HomeNavigation from '../Navigators/Homenavigations';


const MoviePreview = ({ route }) => {
    const movieId = route.params.movieId

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);
    const [genres, setGenres] = useState([]);
    const [trailerLoad, setTrailerLoad] =useState(true)
    const progress = new Animated.Value(0);



    useEffect(() => {
        getMovieDetails()
    }, [])

    const getMovieDetails = async() => {
        const detailsMovie = await getMovieById(movieId);
        const {results} = await getVideos(movieId)
        let videoData = []
        for (let i=0; i<results.length; i++){
            console.log(results)
            videoData.push(
                {
                    url :await videoUrl(results[i]["key"]),
                    title: results[i].name 
                }
            )
        }
        setGenres(detailsMovie.genres)
        setVideos(videoData)
        setTrailerLoad(false)
        setMovieDetails(detailsMovie)
    }

    const videoUrl = async(id) => {
        const youtubeURL = `http://www.youtube.com/watch?v=${id}`;
        const urls = await ytdl(youtubeURL, { quality: 'highest', filter: format => format.container === 'mp4' })
        return urls[0].url
    }


    const genreRender = () => {
        let value = [];

        genres.forEach(ele => {
            value.push(
                <View style={{flex:1, borderWidth:0.3, marginHorizontal: 20, paddingVertical: 5, borderColor: "#F0E68C", height: 20, justifyContent: "center", borderRadius: 20}}>
                    <Text style={{color: "white", alignSelf: "center", marginHorizontal: 10}}>
                        {ele.name}
                    </Text>
                </View>
            )
        })
        return value
    }

    
    return(
        <>  
            <View style={{flex:1,backgroundColor: "black", maxHeight: 213}}>
                <View style={{flex:1, justifyContent: "center"}}>
                    {trailerLoad ? <Text style={{color: "white", fontSize: 15, alignSelf: "center"}}> Loading Trailers... </Text> : 
                        videos.length ?
                            <VideoPlayer
                                video={{ uri: videos[0].url }}
                                autoplay={true}
                                defaultMuted
                                disableSeek
                                videoWidth={1600}
                                videoHeight={1000}
                                customStyles={{controlIcon: {right: 10}, seekBarBackground: {display: "none"},controls: {height: 25},seekBarProgress: {backgroundColor: "green"}, playIcon: {color: "tomato", left:10}}}
                                thumbnail={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` }}
                        />
                        :
                        !videos.length ?  <Text style={{color: "white", fontSize: 15, alignSelf: "center"}}> No Trailers </Text> : null
                    }
                </View>  
                <View 
                    style={{alignSelf: "flex-end", justifyContent: "center", right: 15, position: "absolute", marginVertical: 8}} 
                    >
                        <TouchableOpacity onPress={() => HomeNavigation.goBack()} >
                            <Icon name="close" size={25} color={"white"} />
                        </TouchableOpacity>
                </View>   
            </View>
            
            <View style={{flex:1, borderWidth: 0.2, borderBottomColor: "#9370DB", backgroundColor: "black",maxHeight: 170}}>
                <View style={{flexDirection: "row", justifyContent: "center"}}>
                    <ScrollView horizontal={true} style={{width: 20, marginRight: 60, marginLeft: 20}}>
                        <Text style={{alignSelf: "center", color: "white", fontSize: 20, fontWeight: "bold"}}>{movieDetails.original_title}</Text>
                    </ScrollView>
                    <View style={{borderWidth: 2, borderRadius: 4, borderColor: "grey",height: 18, marginVertical: 10, width: 25, right: 10,justifyContent: "center", alignItems: "center", flexDirection: "column"}}>
                        <Text style={{color: "white"}}>{movieDetails.adult ? "18+": "13+"}</Text>
                    </View>
                </View>
                <View style={{flexDirection:"row"}}>
                    <TouchableOpacity style={{width: 100, marginHorizontal: 20,marginVertical: 30, flexDirection: "row" }}>
                        <View style={{flex: 1, backgroundColor: "white", borderRadius: 2, marginHorizontal: 10, height: 40, justifyContent:"center", alignItems: "center", flexDirection: "row"}}>
                            <Icon name="play" size={25}/>
                            <Text style={{color: "black", fontWeight: "bold", fontSize: 20, fontWeight: "bold"}}>Play</Text>
                        </View>
                    </TouchableOpacity> 
                    <TouchableOpacity style={{width: 200, marginHorizontal: 20,marginVertical: 30, flexDirection: "row" }}>
                        <View style={{flex: 1, backgroundColor: "#DCDCDC", borderRadius: 2, marginHorizontal: 20, height: 40, justifyContent:"center", alignItems: "center", flexDirection: "row"}}>
                            <Fontisto name="play-list" size={15} style={{marginHorizontal: 10}}/>
                            <Text style={{color: "black", fontWeight: "bold", fontSize: 15}}>Add to Playlist</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1, backgroundColor: "black"}}>
                    <ScrollView horizontal={true}>
                        {genreRender()}
                    </ScrollView>
                </View>
            </View>    
            <View style={{flex:1, backgroundColor: "black"}}>
                <ScrollView horizontal={true}>
                    
                </ScrollView>
            </View>
        </>
    )
}

var styles = StyleSheet.create({
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: "100%",
      height: "30%"
    },
  });

export { MoviePreview }