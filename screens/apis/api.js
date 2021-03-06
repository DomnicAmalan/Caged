import { API_KEY } from '../configs/tmdb';
import Axios from 'react-native-axios';
import { ConfigurationContext } from '../contexts/configurationContext'


const genres = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  10770: 'TV Movie',
  
};

export const getImagePath = (path) =>{
  if(path !== null){
    return `https://image.tmdb.org/t/p/original${path}`;
  }
  else{
    return null
  }
}
  
const getBackdropPath = (path) =>
  `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

export const getMovies = async (page, language, media_type) => {
  const API_URL = `https://api.themoviedb.org/3/discover/${media_type}?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}&with_original_language=${language}`;
  const { results } = await fetch(API_URL).then((x) => x.json());
  const movies = results.map(
    ({
      id,
      title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
      original_name
    }) => ({
      key: String(id),
      title: title ? title : original_name,
      poster: getImagePath(poster_path),
      backdrop: getBackdropPath(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genres: genre_ids.map((genre) => genres[genre]),
    })
  );

  return movies;
};

export const getTrending = async (media_type, time_window) => {
  const API_URL = `https://api.themoviedb.org/3/trending/${media_type}/${time_window}?api_key=${API_KEY}`;
  const { results } = await fetch(API_URL).then((x) => x.json());
  const movies = results.map(
    ({
      id,
      title,
      poster_path,
      backdrop_path,
      vote_average,
      overview,
      release_date,
      genre_ids,
      media_type,
      name,
    }) => ({
      key: String(id),
      title: title ? title: name,
      poster: getImagePath(poster_path),
      backdrop: getBackdropPath(backdrop_path),
      rating: vote_average,
      description: overview,
      releaseDate: release_date,
      genres: genre_ids.map((genre) => genres[genre]),
      mediaType: media_type
    })
  );

  return movies;
};

export const getItemById = async (type, Id) => {
  const API_URL = `https://api.themoviedb.org/3/${type}/${Id}?api_key=${API_KEY}&language=en-US&append_to_response=releases,videos`;
  let certification = []
  try{
    const results = await Axios.get(API_URL)
    console.log(results)
  
  
  if(type === 'tv'){
    const API_URL_1 = `https://api.themoviedb.org/3/tv/${Id}/content_ratings?api_key=${API_KEY}`
    const d = await Axios.get(API_URL_1)
    certification = d.data.results
  }

  certification ? results.data['certifications'] = (certification): null
 
  return results.data}
  catch(e){
    console.log(e)
  }
}

export const getVideos = async(type, Id) => {
  const API_URL = `https://api.themoviedb.org/3/${type}/${Id}/videos?api_key=${API_KEY}&language=en-US`
  const results = await Axios.get(API_URL)

  return results.data
}

export const getImages = async() => {
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  const results = await Axios.get(API_URL)

  return results.data
}

export const getMovieRecommendations = async(type, Id) => {
  const API_URL = `https://api.themoviedb.org/3/${type}/${Id}/recommendations?api_key=${API_KEY}`
  const results = await Axios.get(API_URL)
  return results.data.results
}

export const getTvSeasonById = async(tvId, seasonNumber) => {
  const API_URL = `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
  const results = await Axios.get(API_URL)
  const episodeData =  results.data.episodes.map(
    ({
      episode_number,
      name,
      id,
      overview,
      still_path,
      vote_average
    }) => 
    ({
      episodeNumber: episode_number,
      name: name,
      id: id,
      overview: overview,
      poster_path: getImagePath(still_path),
      ratings: vote_average
    })
  );
  let data = {"poster_path": getImagePath(results.data.poster_path), episodes: episodeData, "overview": results.data.overview, air_date: results.data.air_date, }
  return data
}

export const searchItem = async(page,type, query) => {
  const API_URL = `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&language=en-US&query=${query}&page=${page}`;
  const results = await Axios.get(API_URL)
  return results.data
}

export const MovieDownloadDetails = async(imdb_id) => {
  try{
    const API_URL = `https://api.apipop.net/movie?imdb=${imdb_id}`;
    const results = await Axios.get(API_URL)
    const returnData =  results.data.items.map(
      ({
        file,
        id,
        quality,
        torrent_magnet,
        torrent_peers,
        torrent_seeds,
        torrent_url,
        vitality
      }) => 
      ({
        FileName: file,
        Hash: id,
        Quality: quality,
        magnetLink: torrent_magnet,
        Peers: torrent_peers,
        Seeds: torrent_seeds,
        torrentFile: torrent_url,
        vitals: vitality
      })
    )
    return returnData
  }
  catch(e){
    return null
  }
  
}