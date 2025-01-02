import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate(); // Initialize navigate

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === '') {
      setError('Please enter a search term.');
      return;
    }

    try {
      const response = await axios.get("http://localhost:1240/Search",{ params: { q: searchQuery } });
      setError(null); // Clear any previous errors

      // Redirect to the RecipeDetails page with the recipe ID
      navigate(`../RecipeDetails/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data.message || 'Error searching//// for recipe.///');
    }
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <input 
          type="text"
          placeholder="Search recipes by name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error if any */}
    </div>
  );
};

export default Search;
