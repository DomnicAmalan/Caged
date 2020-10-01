import { API_KEY } from '../configs/tmdb';
import Axios from 'react-native-axios'

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
  10770: 'TV Movie',
};

const getImagePath = (path) =>
  `https://image.tmdb.org/t/p/original${path}`;
const getBackdropPath = (path) =>
  `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

export const getMovies = async (page, language) => {
  const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=release_date.desc&page=${page}&with_original_language=${language}`;

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
    }) => ({
      key: String(id),
      title: title,
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

export const getMovieById = async (movieId) => {
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=releases`;
  const results = await Axios.get(API_URL)
  
  return results.data
}

export const getVideos = async(movieId) => {
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  const results = await Axios.get(API_URL)

  return results.data
}

export const getImages = async() => {
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
  const results = await Axios.get(API_URL)

  return results.data
}