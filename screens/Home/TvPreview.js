import React, {useEffect, useState,useContext} from 'react';
import {View, Text, TouchableOpacity, Dimensions, ScrollView,Image} from 'react-native';
import {getItemById, getVideos, getTvSeasonById} from '../apis/api';
import * as HomeNavigation from '../Navigators/Homenavigations';
import Icon from 'react-native-vector-icons/Ionicons';
import ytdl from "react-native-ytdl";
import VideoPlayer from 'react-native-video-player';
import ImageColors from "react-native-image-colors";
import {ConfigurationContext} from '../contexts/configurationContext';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { Picker } from '@react-native-community/picker';

const TvPreview =({ route }) => {
    const tvId = route.params.id
    const [tv, setTv] = useState({})
    const [videos, setVideos] = useState([]);
    const [trailerLoad, setTrailerLoad] =useState(true);
    const [colors, setColors] = useState({});
    const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
    const [certification, setCertification] =useState(null);
    const [playNextTrailer, setPlaynextTrailer] = useState(true);
    const {configuration} = useContext(ConfigurationContext);
    const [genres, setGenres] = useState([]);
    const [episodes, setEpisodes] = useState([]);
    const [currentSeason, setCurrentSeason] = useState(1)

    useEffect(() => {

        getTvDetails();
        getEpisodes();
    }, [currentSeason, episodes])

    const getEpisodes = async() => {
       const data = await getTvSeasonById(tvId, currentSeason);
       setEpisodes(data)
    } 

    const getTvDetails = async() => {
        const detailsTv = await getItemById('tv',tvId);
        setTv(detailsTv)
        // console.log(detailsTv)
        const {results} = await getVideos('tv', tvId)
        const certifications = detailsTv.certifications.filter(country =>   { return country.iso_3166_1 === configuration.country.id  })

        let videoData = []

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
        
        getColorFromURL(detailsTv.poster_path)
        setGenres(detailsTv.genres)
        setVideos(videoData)
        setTrailerLoad(false)
        certifications ? setCertification(certifications[0]) : null
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

    const onEnd = () => {
        const playableIndex = videos.length
        const nextIndex = currentTrailerIndex + 1
        nextIndex < playableIndex ? setCurrentTrailerIndex(nextIndex) : setPlaynextTrailer(false)
    }
    
    const renderSeasonsList = () => {
        let value = []
        for(let idx =1; idx<=tv.number_of_seasons; idx++){
            value.push(
                <Picker.Item key={`seasonslist-${idx}`} label={`${idx}`} value={`${idx}`}/>
            )
        }
        return value
    }

    const renderEpisode = () => {
        let value = []
        if(episodes.episodes){
            episodes.episodes.forEach((item, idx) => {
                value.push(
                    <View key={`episode-${idx}`} style={{flex:1, flexDirection: "row",alignItems: "center", }}>
                        <Image style={{width: 60, height:40, borderRadius: 10,  margin: 10, }} source={{uri: item.poster_path}}/>
                        <View style={{flex:1, borderBottomWidth: 0.3, borderBottomColor: "white",justifyContent:"center"}} >
                            <Text style={{color: "white"}}>
                                {item.name}
                            </Text>
                            <ScrollView horizontal style={{height: 30}}>
                                <Text style={{color: "white"}}>{item.overview}</Text>
                            </ScrollView>
                        </View>
                       
                    </View>
                )
            })
        }
        else{
            value.push(
                <Text>
                    Loading...
                </Text>
            )
        }
        
        return value
    }

    return(
        <View style={{flex:1,backgroundColor: "black"}}>
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
                                thumbnail={{ uri: `https://image.tmdb.org/t/p/original${tv.poster_path}` }}
                                endThumbnail={{ uri: `https://image.tmdb.org/t/p/original${tv.poster_path}` }}
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
            
            <View style={{flex:1, borderWidth: 0.3, borderBottomColor: colors.lightMuted, backgroundColor: "black",maxHeight: 180, marginTop: 10}}>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <ScrollView horizontal={true} style={{width: 20, marginRight: 30, marginLeft: 20}}>
                        <Text style={{alignSelf: "center", color: "white", fontSize: 20, fontWeight: "bold"}}>{tv.name}</Text>
                    </ScrollView>
                    {certification ?
                    <View style={{borderWidth: 2, borderRadius: 4, borderColor: "grey",height: 18, marginVertical: 10, right: 10,justifyContent: "center", alignItems: "center", flexDirection: "column", alignSelf: "flex-start"}}>
                        <Text style={{color: "red", marginHorizontal: 5, fontWeight: "bold"}}>{`${certification.rating}`}</Text>
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
            <View style={{flex:1, justifyContent: "space-between", marginTop: 20, marginHorizontal: 10, flexDirection: "row", maxHeight: 80, borderBottomColor: colors.lightMuted, borderBottomWidth: 0.3,  }}>
                <View style={{flex:1,backgroundColor:"black", maxWidth: 90,maxHeight: 45}}>
                    <View style={{flex:1, flexDirection: "row", backgroundColor:"black"}}>
                        <Text style={{color: "grey", fontWeight: "bold"}}>seasons: </Text>
                        <Picker mode="dropdown" 
                            selectedValue={currentSeason}
                            style={{height:20, width: 100, color: "green"}}
                            onValueChange={(itemValue, itemIndex) =>
                                setCurrentSeason(itemValue)}
                            >
                                {renderSeasonsList()} 
                        </Picker>
                    </View>
                    <View style={{flex:1, alignItems:"center"}}>
                        <Image source={{uri: episodes.poster_path}} style={{height: 40, width: 50, resizeMode: "contain", borderRadius:5}}/>
                    </View>                 
                </View>
                <ScrollView style={{flex:1, backgroundColor: "black", maxHeight:70, width:"100%"}}>
                    <Text style={{color: "grey", fontSize: 12, fontWeight: "bold", }}>{episodes.overview}</Text>
                </ScrollView>
            </View>
            <View style={{flex:1}}>
                <Text style={{color: "white", fontSize:25, fontWeight:"bold", marginHorizontal: 20}}>Episodes</Text>
                <ScrollView style={{flex:1}}>
                    {renderEpisode()}
                </ScrollView>
            </View>
        </View>
    )
}

export { TvPreview }