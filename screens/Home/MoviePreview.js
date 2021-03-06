import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, Dimensions, Image } from 'react-native';
import {getItemById, getVideos, getMovieRecommendations, MovieDownloadDetails} from '../apis/api';
import ytdl from "react-native-ytdl"
import VideoPlayer from 'react-native-video-player';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import * as HomeNavigation from '../Navigators/Homenavigations';
import ImageColors from "react-native-image-colors";
import {ConfigurationContext} from '../contexts/configurationContext';
import Rating from './Rating';
import {Banner, NativeAds} from '../ADS/index';

const MoviePreview = ({ route }) => {
    const movieId = route.params.id
    

    const {configuration} = useContext(ConfigurationContext)

    const [videos, setVideos] = useState([]);
    const [movieDetails, setMovieDetails] = useState([]);
    const [genres, setGenres] = useState([]);
    const [trailerLoad, setTrailerLoad] =useState(true);
    const [colors, setColors] = useState({});
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
    const [playNextTrailer, setPlaynextTrailer] = useState(true);
    const [certification, setCertification] =useState(null);
    const [recommendations, setRecommendation] = useState([]);
    const [data, setData] = useState(null);
    const [movieGet, setMovie] = useState([]);
    const [torrents, setTorrents] = useState([])

    useEffect(() => {
        getMovieDetails();
        return() => {
            getMovieDetails()
        }
    },[])

    const getMovieDetails = async() => {
        const detailsMovie = await getItemById('movie',movieId);
        const downloadDetails = await MovieDownloadDetails(detailsMovie.imdb_id)
        setTorrents(downloadDetails);
       
        setMovieDetails(detailsMovie);
        const {results} = await getVideos('movie',movieId)
        const recommendations = await getMovieRecommendations('movie',movieId);
        setRecommendation(recommendations)
        let videoData = []
        const certifications = detailsMovie.releases.countries.filter(country =>   { return country.iso_3166_1 === configuration.country.id  });
        if(results.length){
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
        }
        

        getColorFromURL(detailsMovie.poster_path)
        setGenres(detailsMovie.genres)
        videoData.length ?  setVideos(videoData) : null
        setTrailerLoad(false)
        certifications ? setCertification(certifications[0]) : null
    }

    const  getColorFromURL = async(path) => {
        if(path !== null){
            const colors = await ImageColors.getColors(`https://image.tmdb.org/t/p/original/${path}`)
            setColors(colors)
        }
        else{
            const colors = {"average": "#291B1B", "darkMuted": "#101010", "darkVibrant": "#B01018", "dominant": "#101010", "lightMuted": "#A8A8A8", "lightVibrant": "#000000", "muted": "#707070", "platform": "android", "vibrant": "#E81820"}
            setColors(colors)
        }
    }

    const videoUrl = async(id) => {
        console.log(id)
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

    const renderSuggestions = (item) => {
        return(
            <View style={{flex:1, marginVertical:30, marginHorizontal: 5}}>
                <TouchableOpacity onPress={() => HomeNavigation.push('moviepreview', {id: item.id})}>
                    <Image style={{ height:150, width:100 }} source={{uri: `https://image.tmdb.org/t/p/original/${item.poster_path}`}}/> 
                </TouchableOpacity>
                
            </View>
        )
    }

    const RequestWorld = () => {
        console.log("requeted to world")
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
                                // autoplay={true}
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
            
            
            <View style={{flex:1, borderWidth: 0.3, borderBottomColor: "#9370DB", backgroundColor: "black",maxHeight: 200, marginTop: 10}}>
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
                    <TouchableOpacity style={{width: 100, marginHorizontal: 20,marginVertical: 30, flexDirection: "row" }} onPress={() => RequestWorld()}>
                        {movieGet.length ?
                            <View style={{flex: 1, backgroundColor: "white", borderRadius: 2, marginHorizontal: 10, height: 40, justifyContent:"center", alignItems: "center", flexDirection: "row"}}>
                                <Icon name="play" size={25}/>
                                <Text style={{color: "black", fontWeight: "bold", fontSize: 20, fontWeight: "bold"}}>Play</Text>
                            </View>: 
                            <TouchableOpacity style={{flex: 1, backgroundColor: "white", borderRadius: 2, marginHorizontal: 10, height: 40, justifyContent:"center", alignItems: "center", flexDirection: "row"}}>
                                <Icon2 name="crosshairs" size={25}/>
                                <Text style={{color: "black", fontWeight: "bold", fontSize: 10, fontWeight: "bold", paddingHorizontal:5}}>Request</Text>
                            </TouchableOpacity> 
                        }
                        
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
            <View style={{flex:1, backgroundColor: "black", marginTop: 30}}>
                <Text style={{color: "white", fontSize:25, fontWeight:"bold", marginHorizontal: 20}}>Suggestions</Text>
                <FlatList
                    horizontal={true}
                    // numColumns={3}
                    data={recommendations}
                    renderItem={({ item }) => renderSuggestions(item)}
                    // onEndReached={() => onNextPage()}
                    onEndReachedThreshold={10}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{flex:1 ,maxHeight: 80, justifyContent: "flex-end"}}>
                
                <NativeAds />
            </View>
            {/* <View style={{flexDirection: "row", margin: 20, alignItems:"center", justifyContent:"center"}}>
                <Text style={{color:"grey", fontWeight: "bold"}}>RELAEASE DATE: </Text>
                <Text style={{color:"white", fontSize: 20, fontWeight:"bold"}}>{movieDetails.release_date}</Text>
            </View>
            {Object.keys(movieDetails).length ? <Rating rating={movieDetails.vote_average} color="tomato"/> :<View style={{alignItems:"center"}}><Text style={{color: "grey", fontSize: 15, fontWeight:"bold"}}>Loading...</Text></View>} */}
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