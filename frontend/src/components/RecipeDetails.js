import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe details
  const [error, setError] = useState(null); // State to store any error
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchRecipe = async () => {
        try {
            const response = await axios.get(`http://localhost:1240/recipe/${id}`);
            console.log('Fetched recipe:', response.data); // Log the fetched recipe
            setRecipe(response.data); // Set the recipe data
            setLoading(false); // Set loading to false after data is fetched
        } catch (err) {
            console.error('Error fetching recipe:', err); // Log the error
            setError(err.response ? err.response.data.message : "Error fetching recipe");
            setLoading(false); // Set loading to false even if there's an error
        }
    };
    fetchRecipe();
}, [id]);

  // Conditional rendering
  if (loading) {
    return <p>Loading...</p>; // Show loading message while fetching data
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>; // Display error message if there's an error
  }

  if (!recipe) {
    return <p>Recipe not found.</p>; // Handle case where recipe is not found
  }

  // Render recipe details if everything is fine
  // Assuming recipe_procedure is an object with from, by, and instructions
return (
  <div>
      <h1>{recipe.recipe_name}</h1>
      <p><strong>No. of Servings:</strong> {recipe.no_of_servings}</p>
      <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
      <p><strong>Diet Type:</strong> {recipe.diet_type}</p>
      <p><strong>General Pricing:</strong> ${recipe.general_pricing}</p>
      <h2>Ingredients</h2>
      <ul>
          {recipe.ingredient_list.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
          ))}
      </ul>
      <h2>Procedure</h2>
      <p><strong>From:</strong> {recipe.recipe_procedure.from}</p>
      <p><strong>By:</strong> {recipe.recipe_procedure.by}</p>
      <p><strong>Instructions:</strong> {recipe.recipe_procedure.instructions}</p>
  </div>
);
};

export default RecipeDetails;