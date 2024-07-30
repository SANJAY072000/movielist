import React from 'react';
import './styles/GenreFilter.css';

const GenreFilter = ({ genres, selectedGenres, onGenreSelect }) => {
  const handleGenreClick = (genreId) => {
    onGenreSelect(genreId);
  };

  return (
    <div className="genre-filter-container">
      {Object.entries(genres).map(([id, name]) => (
        <button
          key={id}
          className={`genre-button ${selectedGenres.includes(parseInt(id)) ? 'selected' : ''}`}
          onClick={() => handleGenreClick(parseInt(id))}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default GenreFilter;
