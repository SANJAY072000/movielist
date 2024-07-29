import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_KEY, API_URL } from '../../../utils/constants';

const useGenres = () => {
  const [genres, setGenres] = useState({});

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/genre/movie/list?api_key=${API_KEY}`
        );
        const genresMap = {};
        response.data.genres.forEach(genre => {
          genresMap[genre.id] = genre.name;
        });
        setGenres(genresMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGenres();
  }, []);

  return genres;
};

export default useGenres;
