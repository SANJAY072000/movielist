import React, { useState } from 'react';
import MovieList from './components/movieList/MovieList';
import './App.css';

const App = () => {
  const [year] = useState(2012);
  return (
    <div className="app">
      <h1>Movie List App</h1>
      <MovieList initialYear={year} />
    </div>
  );
};

export default App;
