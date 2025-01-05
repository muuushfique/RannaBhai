import React from 'react';
import '../css/RecipeOfTheDay.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeOfTheDay = () => {
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      try {
        console.log('about to fetch');
        const response = await axios.get("http://localhost:1240/recipe-of-the-day");
        console.log(response.data);
        setRecipe(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch Recipe of the Day");
      }
    };
    fetchRecipeOfTheDay();
  }, []);

  const today = new Date();
  if (loading) {
    return <div className="rop-loading">Loading Recipe of the Day...</div>;
  }

  return (
    <div className="rop-container">
      <header className="rop-header">
        <div className="rop-date">
          {today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <h1 className="rop-title">Recipe of the Day</h1>
      </header>

      {recipe.image_link && (
        <div className="rop-image">
          <img src={recipe.image_link} alt={recipe.recipe_name} />
        </div>
      )}

      <div className="rop-info">
        <span>Cuisine: {recipe.cuisine}</span>
        <span>Diet Type: {recipe.diet_type}</span>
        <span>👥 Servings: {recipe.no_of_servings}</span>
        <span>🔥 Calories: {recipe.calories}</span>
      </div>

      <div className="rop-card">
        <h2 className="rop-name">{recipe.recipe_name}</h2>

        <div className="rop-section">
          <h3 className="rop-section-title">Ingredients</h3>
          <ul className="rop-list">
            {recipe.ingredient_list.map((ingredient, index) => (
              <li key={index} className="rop-list-item">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="rop-section">
          <h3 className="rop-section-title">Instructions</h3>
          <p className="rop-instructions">{recipe.recipe_procedure.instructions}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeOfTheDay;