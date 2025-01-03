import React, { useState } from "react";
import axios from "axios";
import "./RecipeDetails.css";
import { Link } from "react-router-dom";
const Search = () => {
  // Separate states for each search field
  const [recipeNameQuery, setRecipeNameQuery] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [cuisineQuery, setCuisineQuery] = useState("");
  const [dietTypeQuery, setDietTypeQuery] = useState("");
  const [caloriesQuery, setCaloriesQuery] = useState("");

  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // Handle search submission for each field
  const handleSearchSubmit = async (e, searchType, query) => {
    e.preventDefault();
  
    if (query.trim() === "") {
      setError("Please enter a search term.");
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:1240/${searchType}`, {
        params: { q: query },
      });
      setError(null);
      setSearchResults(response.data);
    } catch (err) {
      setError(err.response?.data.message || "Error searching for recipe.");
    }
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Search Recipes</h1>
      <div className="faq-list">

      {/* Search by Recipe Name */}
      <form
        onSubmit={(e) =>
          handleSearchSubmit(e, "search-recipe-name", recipeNameQuery)
        }
      >
        <input
          type="text"
          placeholder="Search by recipe name"
          value={recipeNameQuery}
          onChange={(e) => setRecipeNameQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Search by Ingredient */}
      <form
        onSubmit={(e) =>
          handleSearchSubmit(e, "search-ingredient", ingredientQuery)
        }
      >
        <input
          type="text"
          placeholder="Search by ingredient"
          value={ingredientQuery}
          onChange={(e) => setIngredientQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Search by Cuisine */}
      <form
        onSubmit={(e) => handleSearchSubmit(e, "search-cuisine", cuisineQuery)}
      >
        <input
          type="text"
          placeholder="Search by cuisine"
          value={cuisineQuery}
          onChange={(e) => setCuisineQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Search by Diet Type */}
      <form
        onSubmit={(e) =>
          handleSearchSubmit(e, "search-diet-type", dietTypeQuery)
        }
      >
        <input
          type="text"
          placeholder="Search by diet type"
          value={dietTypeQuery}
          onChange={(e) => setDietTypeQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>


<form
  onSubmit={(e) =>
    handleSearchSubmit(e, "search-calories", caloriesQuery)
  }
>
  <input
    type="text"
    placeholder="Search by calories"
    value={caloriesQuery}
    onChange={(e) => setCaloriesQuery(e.target.value)}
  />
  <button type="submit">Search</button>
</form>
</div>
      {/* Error Message */}
      {error && <p className="error">{error}</p>}
      {searchResults.length === 0 ? (
        <p className="loading">No results found.</p>
      ) : (
        <ul>
          {searchResults.map((recipe) => (
            <li key={recipe._id}>
              <Link to={`/RecipeDetails/${recipe._id}`} className="faq-question">
                {recipe.recipe_name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;