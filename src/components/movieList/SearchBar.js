import React, { useState } from 'react';
import './styles/SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
