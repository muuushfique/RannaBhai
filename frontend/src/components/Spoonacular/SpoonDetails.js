import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function SpoonDetails() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRecipeDetails = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const apiKey = "dfeee5ed5aef40269b747f33dddac849"; // Replace with your actual API key
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
      );
      setRecipe(response.data);
    } catch (err) {
      console.error("Error fetching recipe details:", err);
      setError("Failed to fetch recipe details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]); // 'id' is a dependency

  useEffect(() => {
    fetchRecipeDetails();
  }, [fetchRecipeDetails]); // Add 'fetchRecipeDetails' to the dependency array

  if (loading) return <p>Loading recipe details...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="spoon-details-container">
      <div className="spoon-details-header">
        <h1>{recipe.title}</h1>
        <img src={recipe.image} alt={recipe.title} className="spoon-details-image" />
      </div>
      <div className="spoon-details-info">
        <p><strong>Servings:</strong> {recipe.servings}</p>
        <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
      </div>
      <div className="spoon-details-content">
        <h2>Ingredients</h2>
        <ul className="ingredients-list">
          {recipe.extendedIngredients.map((ingredient) => (
            <li key={ingredient.id}>{ingredient.original}</li>
          ))}
        </ul>
        <h2>Instructions</h2>
        <p className="instructions">
          {recipe.instructions || "No instructions available."}
        </p>
      </div>
    </div>
  );
}

export default SpoonDetails;
