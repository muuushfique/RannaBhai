import React from 'react';
import '../css/RecipeOfTheDay.css';
import {useState,useEffect} from 'react'
import axios from 'axios';


const RecipeOfTheDay = () => {
  const [loading, setLoading] = useState(true);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeOfTheDay = async () => {
      try {
        console.log('about to fetch')
        const response = await axios.get("http://localhost:1240/recipe-of-the-day");
        console.log(response.data)
        setRecipe(response.data);
        setLoading(false)
      } catch (err) {
        setError("Failed to fetch Recipe of the Day");
      }
    };
    fetchRecipeOfTheDay();
  }, []);
  const today= new Date()
  if (loading) {
    return <div className="loading">Loading Recipe of the day...</div>;
  }

  return (
    
    <div className="recipe-container">
      <header className="recipe-header">
        <div className="recipe-date">
          {today.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <h1 className="recipe-title">Recipe of the Day</h1>
      </header>

      {/* <div className="recipe-tags">
        {recipe.tags.map((tag, index) => (
          <span key={index} className="tag">{tag}</span>
        ))}
      </div> */}

      {recipe.image_link && (
        <div className="recipe-image">
          <img src={recipe.image_link} alt={recipe.recipe_name} />
        </div>
      )}

      <div className="recipe-info">
        <span>Cuisine: {recipe.cuisine}</span>
        <span>Diet Type: {recipe.diet_type}</span>
        <span>👥 Servings: {recipe.no_of_servings}</span>
        <span>🔥 Calories: {recipe.calories}</span>
      </div>

      <div className="recipe-card">
        <h2 className="recipe-name">{recipe.recipe_name}</h2>
{/* 
       // <div className="recipe-metadata">
       //   <span>⏱️ {recipe.time}</span>
        //  <span>📊 {recipe.difficulty}</span>
      //  </div>  */}

        <div className="recipe-section">
          <h3 className="section-title">Ingredients</h3>
          <ul className="recipe-list">
            {recipe.ingredient_list.map((ingredient, index) => (
              <li key={index} className="recipe-list-item">{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="recipe-section">
          <h3 className="section-title">Instructions</h3>
          <p className="recipe-instructions">{recipe.recipe_procedure.instructions}</p>
        </div>
        
      </div>
    </div>
  );
};

export default RecipeOfTheDay;