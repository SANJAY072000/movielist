import React, { useEffect, useRef } from 'react';
import useMovies from './hooks/useMovies';
import useGenres from './hooks/useGenres';
import useProcessedMovies from './hooks/useProcessedMovies';
import MovieCard from './MovieCard';
import './styles/MovieList.css';

const MovieList = () => {
  const {
    movies,
    loading,
    hasMoreMovies,
    year,
    setYear,
    page,
    setPage,
    setHasMoreMovies,
    fetchMovies
  } = useMovies();

  const genres = useGenres();
  const processedMovies = useProcessedMovies(movies);
  const bottom = useRef(null);

  // Fetch movies when year, page, or hasMoreMovies changes
  useEffect(() => {
    const fetchAndSetMovies = async () => {
      if (hasMoreMovies) {
        await fetchMovies(year, page);
      } else {
        // Move to the next year if no more movies are available
        setYear(prevYear => prevYear + 1);
        setPage(1);
        setHasMoreMovies(true);
      }
    };
    
    fetchAndSetMovies();
  }, [year, page, hasMoreMovies]);

  // Set up the IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMoreMovies) {
        console.log("sinwsanj0");
        setPage(prevPage => prevPage + 1);
      }
    }, {
      root: null,
      rootMargin: '50px',
      threshold: 1.0
    });

    const bottomElement = bottom.current;
    if (bottomElement) {
      observer.observe(bottomElement);
    }

    return () => {
      if (bottomElement) {
        observer.unobserve(bottomElement);
      }
    };
  }, [loading, hasMoreMovies]);

  return (
    <div className="movie-list-container">
      <div className="movie-list">
        {processedMovies.map(item =>
          item.type === 'heading' ? (
            <div key={item.key} className="year-heading-container">
              <h2 className="year-heading">Movies of {item.year}</h2>
            </div>
          ) : (
            <MovieCard key={item.key} movie={item.movie} genres={genres} />
          )
        )}
        <div ref={bottom} style={{ height: '1px' }}></div>
      </div>
    </div>
  );
};

export default MovieList;
