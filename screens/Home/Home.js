import * as React from 'react';
import {
  StatusBar,
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Platform,
  Easing
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { getMovies, getTrending } from '../apis/api';
import Genres from './Genres';
import Rating from './Rating';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import * as HomeNavigation from '../Navigators/Homenavigations';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import {ConfigurationContext} from '../contexts/configurationContext';
import { useState } from 'react';
// import {Tabbar} from './Tabbar'


const SPACING = 10;
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.74;
const EMPTY_ITEM_SIZE = (width - ITEM_SIZE) / 2;
const BACKDROP_HEIGHT = height * 0.65;

const Loading = () => {
  const progress = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
      useNativeDriver: true
    }).start();
  }, [])

  return(
    <View style={styles.loadingContainer}>
      <LottieView style={{width: 100}} source={require('../assets/loading.json')} progress={progress} />
      <Text style={styles.paragraph}>Loading...</Text>
    </View>
  )
};

const Backdrop = ({ movies, scrollX }) => {
  return (
    <View style={{ height: BACKDROP_HEIGHT, width, position: 'absolute' }}>
     
      <FlatList
        data={movies.reverse()}
        keyExtractor={(item) => item.key + '-backdrop'}
        removeClippedSubviews={false}
        contentContainerStyle={{ width, height: BACKDROP_HEIGHT }}
        renderItem={({ item, index }) => {
          if (!item.backdrop) {
            return null;
          }
          const translateX = scrollX.interpolate({
            inputRange: [(index - 2) * ITEM_SIZE, (index - 1) * ITEM_SIZE],
            outputRange: [0, width],
            // extrapolate:'clamp'
          });
          return (
            <Animated.View
              removeClippedSubviews={false}
              style={{
                position: 'absolute',
                width: translateX,
                height,
                overflow: 'hidden',
              }}
            >
              <Image
                source={{ uri: item.backdrop }}
                style={{
                  width,
                  height: BACKDROP_HEIGHT,
                  position: 'absolute',
                }}
              />
            </Animated.View>
          );
        }}
      />
      <LinearGradient
        colors={['rgba(0, 0, 0, 0)', 'white']}
        style={{
          height: BACKDROP_HEIGHT,
          width,
          position: 'absolute',
          bottom: 0,
        }}
      />
    </View>
  );
};

export const HomePage = () => {
  const [movies, setMovies] = React.useState([]);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { configuration} = React.useContext(ConfigurationContext);
  const [mediaType, setMediaType] = useState('tv');
  const [timeWindow, setTimeWindow] = useState('week');
  const [showRegional, setRegional] = useState(true);
  React.useEffect(() => {
    const fetchData = async () => {
      setMovies([])
      const movies = showRegional ? await getMovies(1, configuration.language.id, mediaType === 'all' ? 'movie': mediaType === 'movie' ? 'movie': 'tv'): await getTrending(mediaType, timeWindow)
      setMovies([{ key: 'empty-left' }, ...movies, { key: 'empty-right' }]);
    };
    
    fetchData(movies);
    
  }, [mediaType, showRegional]);

  if (movies.length === 0) {
    return <Loading />;
  }
  
  return (
    <View style={styles.container}>
      
      <Backdrop movies={movies} scrollX={scrollX} />
      
      
      <StatusBar hidden />
      <Animated.FlatList
        showsHorizontalScrollIndicator={false}
        data={movies}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
        renderToHardwareTextureAndroid
        contentContainerStyle={{ alignItems: 'center' }}
        snapToInterval={ITEM_SIZE}
        snapToAlignment='start'
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          if (!item.poster) {
            return <View style={{ width: EMPTY_ITEM_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
          ];

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [100, 50, 100],
            extrapolate: 'clamp',
          });
          return (
            <View style={{ width: ITEM_SIZE }}>
              <Animated.View 
                style={{
                  marginHorizontal: SPACING,
                  padding: SPACING * 2,
                  alignItems: 'center',
                  transform: [{ translateY }],
                  backgroundColor: 'black',
                  borderRadius: 34,
                }}
              ><TouchableOpacity onPress={() => HomeNavigation.navigate(item.mediaType === 'movie' ? 'moviepreview': 'tvpreview', {id: item.key})}>
                <Image 
                  source={{ uri: item.poster }}
                  style={styles.posterImage}
                />
                <View style={{alignItems: "center", flexDirection: "row", justifyContent: "center"}}>
                  <Text style={{color: "#329999", fontSize: 10, fontWeight: "bold", textTransform: 'uppercase'}}>{item.mediaType ? item.mediaType : mediaType}</Text>
                </View>
                
                
                <Text style={{fontWeight:"bold", fontSize: 20, color: "green" }} numberOfLines={1}>
                  {item.title}
                </Text>
                <Rating rating={item.rating} color="tomato"/>
                <Genres genres={item.genres} />
                  <Text style={{ fontSize: 12, color: "#FFFAFA" }} numberOfLines={3}>
                    {item.description}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          );
        }}
      />
      <View style={{flex:1, alignItems: "center", justifyContent: "space-around", flexDirection:"row"}}>
        <LinearGradient start={{x: 1, y: 0}} 
            colors={['#0d253f', '#01b4e4', '#90cea1' ]}
            style={{height: 30, backgroundColor: "white", marginHorizontal: 30, borderRadius: 25, alignItems: "space-between", flexDirection: "row", justifyContent: "space-between"}}
        >
          <TouchableHighlight style={{backgroundColor: mediaType === 'all' ? "#0d253f": null, flex:1, borderRadius: 25, height:30}} onPress={() => {mediaType !== 'all' ? [setMediaType('all'),setMovies([])]: null}}>
            <Text style={{fontSize: 20, fontWeight: "bold", marginHorizontal: 10, color: "white"}}>All</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{backgroundColor: mediaType === 'movie' ? "#0d253f": null, flex:1, borderRadius: 25, height:30}} onPress={() => {mediaType !== 'movie' ? setMediaType('movie'): null}}>
            <Text style={{fontSize: 20, fontWeight: "bold", marginHorizontal: 10, color: "white"}}>Movies</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{backgroundColor: mediaType === 'tv' ? "#0d253f": null, flex:1, borderRadius: 25, height:30}} onPress={() => {mediaType !== 'tv' ? setMediaType('tv'): null}}>
            <Text style={{fontSize: 20, fontWeight: "bold", marginHorizontal: 10, color: "white"}}>TV</Text>
          </TouchableHighlight>
        </LinearGradient>
        <LinearGradient start={{x: 1, y: 0}} 
            colors={['#0d253f', '#01b4e4', '#90cea1' ]}
            style={{height: 20, backgroundColor: "white", marginHorizontal: 30, borderRadius: 25, alignItems: "space-between", flexDirection: "row", justifyContent: "space-between"}}
        >
          <TouchableHighlight style={{backgroundColor:showRegional ? "#0d253f": null, flex:1, borderRadius: 25, height:30}} onPress={() => setRegional(true)}>
            <Text style={{fontSize: 15, fontWeight: "bold", marginHorizontal: 10, color: "white"}}>Regional</Text>
          </TouchableHighlight>
          <TouchableHighlight style={{backgroundColor: !showRegional ? "#0d253f": null, flex:1, borderRadius: 25, height:30}} onPress={() => setRegional(false)}>
            <Text style={{fontSize: 15, fontWeight: "bold", marginHorizontal: 10, color: "white"}}>World</Text>
          </TouchableHighlight>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: "black"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  posterImage: {
    width: '100%',
    height: ITEM_SIZE * 1.2,
    resizeMode: 'cover',
    borderRadius: 24,
    margin: 0,
    marginBottom: 10,
  },
});