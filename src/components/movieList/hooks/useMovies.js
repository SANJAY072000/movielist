import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_KEY, API_URL } from '../../../utils/constants';

const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const [year, setYear] = useState(2012);
  const [page, setPage] = useState(1);

  const fetchMovies = async (year, page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&primary_release_year=${year}&vote_count.gte=100&page=${page}`
      );
      // if (response.data.results.length === 0) {
      /**
       * This means that at page 3 it will not give any response hence move to the next year.
       */
      if (page === 3) {
        setHasMoreMovies(false);
      } else {
        setMovies(prevMovies => [
          ...prevMovies,
          ...response.data.results.map(movie => ({
            ...movie,
            uniqueKey: `${movie.id}-${page}-${year}`
          }))
        ]);
      }
    } catch (err) {
      console.error(err);
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
