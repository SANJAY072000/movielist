import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, API_URL } from '../../../utils/constants';

const useMovies = (selectedGenres, searchQuery) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [year, setYear] = useState(2012);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    //Debouncing
    const timer = setTimeout(async () => {
      await fetchMovies(year, page);
    }, 2000);

    return () => {
        clearTimeout(timer);
    };
  }, [searchQuery]);

  const fetchMovies = async (year, page) => {
    setLoading(true);
    try {
      const genreQuery = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.join(',')}` : '';
      const genreResponse = await axios.get(
        `${API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100&page=${page}${genreQuery}`
      );
      
      const searchQueryParam = searchQuery ? `&query=${searchQuery}` : '';
      let searchQueryResponse = { data: { results: [] } };
      if (searchQuery) {
        searchQueryResponse = await axios.get(
          `${API_URL}/search/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100&page=${page}${searchQueryParam}`
        );
      }
      
      const genreResults = genreResponse.data.results || [];
      const searchResults = searchQueryResponse.data.results || [];
  
      if (page === 3) {
        setHasMoreMovies(false);
      } else if (selectedGenres.length > 0) {
        setMovies(prevMovies => [
          ...genreResults.map(movie => ({
            ...movie,
            uniqueKey: `${movie.id}-${page}-${year}`
          }))
        ]);
      } else if (searchQuery) {
        setMovies(prevMovies => [
          ...searchResults.map(movie => ({
            ...movie,
            uniqueKey: `${movie.id}-${page}-${year}`
          }))
        ]);
      } else {
        setMovies(prevMovies => [
          ...prevMovies,
          ...genreResults.map(movie => ({
            ...movie,
            uniqueKey: `${movie.id}-${page}-${year}`
          }))
        ]);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    movies,
    loading,
    hasMoreMovies,
    year,
    setYear,
    page,
    setPage,
    setHasMoreMovies,
    fetchMovies
  };
};

export default useMovies;
