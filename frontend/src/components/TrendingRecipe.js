import React, { useState, useEffect } from "react";
import axios from "axios";

function TrendingRecipe() {
  const [recipes, setRecipes] = useState([]);

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:1240/api/trending-recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Handle like and dislike actions
  const handleVote = async (recipeId, voteType) => {
    try {
      // Find the recipe by its `id` (int32)
      const recipeToUpdate = recipes.find((recipe) => recipe.id === recipeId);

      if (!recipeToUpdate) return; // If no recipe is found, exit early

      // Prepare the updated vote count
      const updatedVotes = {
        like_count:
          voteType === "like" ? recipeToUpdate.like_count + 1 : recipeToUpdate.like_count,
        dislike_count:
          voteType === "dislike" ? recipeToUpdate.dislike_count + 1 : recipeToUpdate.dislike_count,
      };

      // Optimistically update the state
      const updatedRecipes = recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              like_count: updatedVotes.like_count,
              dislike_count: updatedVotes.dislike_count,
            }
          : recipe
      );
      setRecipes(updatedRecipes);

      // Send the updated votes to the backend
      const response = await axios.put(
        `http://localhost:1240/api/recipe/vote/${recipeId}`,
        {
          like_count: updatedVotes.like_count,
          dislike_count: updatedVotes.dislike_count,
        }
      );

      // Sync with backend response (optional)
      if (response.data) {
        const refreshedRecipes = await axios.get("http://localhost:1240/api/trending-recipes");
        setRecipes(refreshedRecipes.data);
      }
    } catch (error) {
      console.error("Error updating votes:", error);
      alert("Failed to update vote. Please try again.");

      // Rollback UI if request fails
      const rolledBackRecipes = recipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              like_count:
                voteType === "like" ? recipe.like_count - 1 : recipe.like_count,
              dislike_count:
                voteType === "dislike" ? recipe.dislike_count - 1 : recipe.dislike_count,
            }
          : recipe
      );
      setRecipes(rolledBackRecipes);
    }
  };

  return (
    <div className="trending-recipes">
      <h1>Trending Recipes</h1>
      <div className="recipe-list d-flex flex-wrap justify-content-center">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image_link}
              alt={recipe.recipe_name}
              style={{ height: "200px", objectFit: "cover" }}
            />
            <h3>{recipe.recipe_name}</h3>
            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            <p><strong>Diet:</strong> {recipe.diet_type}</p>
            <div className="recipe-actions d-flex justify-content-center">
              <button
                className="btn btn-success"
                onClick={() => handleVote(recipe.id, "like")}
              >
                Like {recipe.like_count}
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleVote(recipe.id, "dislike")}
              >
                Dislike {recipe.dislike_count}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrendingRecipe;
