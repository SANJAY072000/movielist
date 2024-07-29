import React, { forwardRef } from 'react';
import './styles/MovieList.css';

const MAX_DESCRIPTION_LENGTH = 100; // Maximum length for the description before truncation

const truncateDescription = (description, maxLength) => {
  if (description.length > maxLength) {
    return `${description.substring(0, maxLength)}...`;
  }
  return description;
};

const MovieCard = forwardRef(({ movie, genres }, ref) => {
  const { title, poster_path, overview, genre_ids } = movie;
  const truncatedOverview = truncateDescription(overview, MAX_DESCRIPTION_LENGTH);

  return (
    <div className="movie-card" ref={ref}>
      <img src={`https://image.tmdb.org/t/p/w500${poster_path}`} alt={title} />
      <div className="movie-details">
        <h3>{title}</h3>
        <p>{truncatedOverview}</p>
        <div className="genres">
          {genre_ids.map(id => (
            <span key={id} className="genre">{genres[id]}</span>
          ))}
        </div>
      </div>
    </div>
  );
});

export default MovieCard;
