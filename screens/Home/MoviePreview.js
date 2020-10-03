import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Alert, Dimensions } from 'react-native';
import {getMovieById, getVideos, getImages} from '../apis/api';
import ytdl from "react-native-ytdl"
import VideoPlayer from 'react-native-video-player';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as HomeNavigation from '../Navigators/Homenavigations';
import * as RNLocalize from "react-native-localize";
import ImageColors from "react-native-image-colors";

const MoviePreview = ({ route }) => {
    const movieId = route.params.movieId

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);
    const [genres, setGenres] = useState([]);
    const [trailerLoad, setTrailerLoad] =useState(true);
    const [colors, setColors] = useState({});
    const progress = new Animated.Value(0);
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
    const [repeat, setRepeat] = useState(false);
    const [playNextTrailer, setPlaynextTrailer] = useState(true);
    const [certification, setCertification] =useState(null);


    useEffect(() => {
        getMovieDetails();
    }, [])

    const getMovieDetails = async() => {
        const detailsMovie = await getMovieById(movieId);
        const {results} = await getVideos(movieId)
        let videoData = []
        console.log(detailsMovie.releases)
        const certifications = detailsMovie.releases.countries.filter(country =>   { return country.iso_3166_1 === 'IN' });
        console.log(certifications)

        for (let i=0; i<results.length; i++){
            const urlreturn = await videoUrl(results[i]["key"])
            urlreturn ? 
                videoData.push(
                    {
                        url :  urlreturn,
                        title: results[i].name 
                    }
                ): null
            
        }
        getColorFromURL(detailsMovie.poster_path)
        setGenres(detailsMovie.genres)
        videoData.length ?  setVideos(videoData) : null
        setTrailerLoad(false)
        setMovieDetails(detailsMovie)
        certifications ? setCertification(certifications[0]) : null
    }

    const  getColorFromURL = async(path) => {
        const colors = await ImageColors.getColors(`https://image.tmdb.org/t/p/original/${path}`)
        setColors(colors)
    }

    const videoUrl = async(id) => {
        const youtubeURL = `http://www.youtube.com/watch?v=${id}`;
        try{
            const urls = await ytdl(youtubeURL, { quality: 'highest', filter: format => format.container === 'mp4' })
            return urls[0].url
        }
        catch(e){
            console.log(e.message)
            return null
        }
    }


    const genreRender = () => {
        let value = [];

        genres.forEach((ele, idx) => {
            value.push(
                <View key={`genre-${idx}`} style={{flex:1, borderWidth:0.3, marginHorizontal: 20, paddingVertical: 5, borderColor: "#F0E68C", height: 20, justifyContent: "center", borderRadius: 20}}>
                    <Text style={{color: "white", alignSelf: "center", marginHorizontal: 10}}>
                        {ele.name}
                    </Text>
                </View>
            )
        })
        return value
    }

    const onEnd = () => {
        const playableIndex = videos.length
        const nextIndex = currentTrailerIndex + 1
        nextIndex < playableIndex ? setCurrentTrailerIndex(nextIndex) : setPlaynextTrailer(false)
    }

    
    return(
        <View style={{flex: 1, backgroundColor:"black"}}>  
            <View style={{flex:1,backgroundColor: "black", maxHeight: 180}}>
                
                <View style={{flex:1, justifyContent: "center"}}>
                    {trailerLoad ? <Text style={{color: "white", fontSize: 15, alignSelf: "center"}}> Loading Trailers... </Text> : 
                        videos.length ?
                        <>
                            <VideoPlayer
                                key={currentTrailerIndex}
                                video={{ uri: videos[currentTrailerIndex].url }}
                                autoplay={true}
                                onEnd={onEnd}
                                useNativeControls
                                // fullScreenOnLongPress={true}
                                disableFullscreen={false}
                                loop={true}
                                // onProgress={onEnd}
                                // repeat={repeat}
                                pictureInPicture={true}
                                hideControlsOnStart={true}
                                // isExternalPlaybackActive={true}
                                // onProgress={onEnd}
                                // defaultMuted
                                // disableSeek
                                videoWidth={Dimensions.get('screen').width}
                                videoHeight={180}
                                customStyles={{playControl: {position: "absolute", flex: 1, bottom: 90, left: "45%"},seekBar: {}, controlButton: {}, seekBarKnob: {backgroundColor: colors.average}, seekBarBackground: {backgroundColor: colors.lightMuted},controls: {},seekBarProgress: {backgroundColor: colors.darkMuted}, playIcon: {color: "#FFFAFA"}}}
                                thumbnail={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` }}
                                endThumbnail={{ uri: `https://image.tmdb.org/t/p/original${movieDetails.poster_path}` }}
                        />                        
                        </>
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
            
            <View style={{flex:1, borderWidth: 0.2, borderBottomColor: "#9370DB", backgroundColor: "black",maxHeight: 170, marginTop: 10}}>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <ScrollView horizontal={true} style={{width: 20, marginRight: 30, marginLeft: 20}}>
                        <Text style={{alignSelf: "center", color: "white", fontSize: 20, fontWeight: "bold"}}>{movieDetails.title}</Text>
                    </ScrollView>
                    {certification ?
                    <View style={{borderWidth: 2, borderRadius: 4, borderColor: "grey",height: 18, marginVertical: 10, right: 10,justifyContent: "center", alignItems: "center", flexDirection: "column", alignSelf: "flex-start"}}>
                        <Text style={{color: "red", marginHorizontal: 5, fontWeight: "bold"}}>{`${certification.certification}`}</Text>
                    </View>: null}
                    <View 
                        style={{alignSelf: "flex-start", justifyContent: "center", marginVertical: 8, marginRight: 5}} 
                        >
                            {playNextTrailer && videos.length ? 
                                <TouchableOpacity style={{flexDirection: "row", width: 120, backgroundColor: "white", height: 30 , borderRadius: 5, alignItems: "center", justifyContent: "center"}} onPress={() => onEnd()} >
                                    <Icon name="play-skip-forward" size={20} color={"black"} />
                                    <Text style={{color: "black", fontSize: 15, fontWeight: "bold"}}>Next Trailer</Text>
                                </TouchableOpacity> : null
                                
                            }
                            
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
        </View>
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