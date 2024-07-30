const useProcessedMovies = (movies) => {
  const transformedMovies = [];
  let lastYear = null;

  movies?.forEach(movie => {
    const movieYear = movie.release_date.split('-')[0];
    if (movieYear !== lastYear) {
      transformedMovies.push({
        type: 'heading',
        key: `heading-${movieYear}`,
        year: movieYear
      });
      lastYear = movieYear;
    }
    transformedMovies.push({
      type: 'movie',
      key: movie.uniqueKey,
      movie
    });
  });

  return transformedMovies;
};

export default useProcessedMovies;
