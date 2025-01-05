import React, { useState } from "react";
import axios from "axios";
import "./../../Customcss/RandomRecipe.css";

function RandomRecipe() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchRandomRecipe = async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = "dfeee5ed5aef40269b747f33dddac849"; // Replace with your actual API key
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/random?apiKey=${apiKey}`
      );
      const fetchedRecipe = response.data.recipes[0];
      setRecipe(fetchedRecipe);
    } catch (err) {
      console.error("Error fetching random recipe:", err);
      setError(
        err.response?.data?.message ||
        "Failed to fetch a random recipe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="random-recipe-container">
      <h1>Random Recipe Generator</h1>
      <p>Click the button below to discover a random recipe!</p>
      <button onClick={fetchRandomRecipe} className="random-recipe-button">
        Surprise Me!
      </button>
      {loading && <p>Loading recipe...</p>}
      {error && <p className="error-message">{error}</p>}
      {recipe && (
        <div className="recipe-details">
          <h2 className="recipe-title">{recipe.title}</h2>
          <div className="image-container">
            <img
              src={recipe.image || "https://via.placeholder.com/600x400?text=No+Image+Available"}
              alt={recipe.title}
              className="recipe-image"
            />
          </div>
          <p><strong>Servings:</strong> {recipe.servings}</p>
          <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
          <h3>Ingredients</h3>
          <ul>
            {recipe.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>{ingredient.original}</li>
            ))}
          </ul>
          <h3>Instructions</h3>
          <p>{recipe.instructions || "No instructions available."}</p>
        </div>
      )}
    </div>
  );
}

export default RandomRecipe;
