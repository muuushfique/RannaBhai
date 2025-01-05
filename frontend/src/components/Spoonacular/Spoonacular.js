import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './../../Customcss/Spoon.css'

function Spoon() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const apiKey = "dfeee5ed5aef40269b747f33dddac849";
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/complexSearch?number=50&query=${query}&apiKey=${apiKey}`
      );
      setRecipes(response.data.results);
    } catch (err) {
      console.error("Error fetching recipes:", err);
      setError("Failed to fetch recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchRecipes(searchTerm);
  };

  const viewRecipeDetails = (id) => {
    navigate(`/spoon-details/${id}`); // Updated route
  };

  return (
    <div className="recipe-page">
      <h1>Discover Recipes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      {loading && <p>Loading recipes...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="recipe-card"
            onClick={() => viewRecipeDetails(recipe.id)} // Updated navigation
          >
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <h3>{recipe.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spoon;
