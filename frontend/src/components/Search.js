// SearchBar.js

import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      setResults([]);  // Clear results if query is empty
      return;
    }

    try {
      const response = await axios.get(`/search`, { params: { q: searchQuery } });
      setResults(response.data);  // Set results to the response from backend
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text"
          placeholder="Search items"
          value={searchQuery}
          onChange={handleSearchChange}
        />     
        <button type="submit">Search</button>
      </form>

      <ul>
        {results.map((item) => (
          <li key={item._id}>{item.name}</li>  // Display item names
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;

  