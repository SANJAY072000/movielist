import React, { useEffect, useState } from 'react';
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized';
import useMovies from './hooks/useMovies';
import useGenres from './hooks/useGenres';
import useProcessedMovies from './hooks/useProcessedMovies';
import MovieCard from './MovieCard';
import GenreFilter from './GenreFilter';
import SearchBar from './SearchBar';
import './styles/MovieList.css';

const MovieList = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
  } = useMovies(selectedGenres, searchQuery);

  const genres = useGenres();
  const processedMovies = useProcessedMovies(movies);

  useEffect(() => {
    const fetchMoreRows = async () => {
      if (hasMoreMovies) {
        await fetchMovies(year, page);
      } else {
        setYear(prevYear => prevYear + 1);
        setPage(1);
        setHasMoreMovies(true);
      }
    };
    if (selectedGenres.length === 0 && !searchQuery) {
      fetchMoreRows();
    }
  }, [year, page, hasMoreMovies, selectedGenres, searchQuery]);

  useEffect(() => {
    const fetchSelectedGenreMovies = async () => {
      await fetchMovies(year, page);
    };
    fetchSelectedGenreMovies();
  }, [selectedGenres]);

  const isRowLoaded = ({ index }) => processedMovies[index];

  const loadMoreRows = () => {
    if (!loading && hasMoreMovies) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const rowRenderer = ({ key, index, style }) => {
    const item = processedMovies[index];
    if (!item) return null;
    return item.type === 'heading' ? (
      <div key={key} className="year-heading-container" style={style}>
        <h2 className="year-heading">Movies of {item.year}</h2>
      </div>
    ) : (
      <div key={key} style={style}>
        <MovieCard movie={item.movie} genres={genres} />
      </div>
    );
  };

  const debouncedSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="movie-list-container">
      <GenreFilter
        genres={genres}
        selectedGenres={selectedGenres}
        onGenreSelect={(id) => {
          setSelectedGenres(prevSelectedGenres =>
            prevSelectedGenres.includes(id)
              ? prevSelectedGenres.filter(genreId => genreId !== id)
              : [...prevSelectedGenres, id]
          );
        }}
      />
      <SearchBar onSearch={debouncedSearch} />
      <AutoSizer>
        {({ height, width }) => (
          <InfiniteLoader
            isRowLoaded={isRowLoaded}
            loadMoreRows={loadMoreRows}
            rowCount={processedMovies.length + 1}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={processedMovies.length}
                rowHeight={400}
                rowRenderer={rowRenderer}
                width={width}
              />
            )}
          </InfiniteLoader>
        )}
      </AutoSizer>
    </div>
  );
};

export default MovieList;
