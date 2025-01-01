import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf'; // Import jsPDF

function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('both'); // 'both', 'veg', or 'nonveg'

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://localhost:1240/recipes'); // Adjust the URL if needed
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // Handle Like
  const handleLike = async (recipeId) => {
    try {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => {
          if (recipe.id === recipeId) {
            const isLiked = recipe.isLiked || false;
            return {
              ...recipe,
              like_count: isLiked ? recipe.like_count - 1 : recipe.like_count + 1,
              dislike_count: recipe.isDisliked ? recipe.dislike_count - 1 : recipe.dislike_count,
              isLiked: !isLiked,
              isDisliked: false,
            };
          }
          return recipe;
        })
      );

      const response = await fetch(`http://localhost:1240/recipes/${recipeId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update like count');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Handle Dislike
  const handleDislike = async (recipeId) => {
    try {
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => {
          if (recipe.id === recipeId) {
            const isDisliked = recipe.isDisliked || false;
            return {
              ...recipe,
              dislike_count: isDisliked ? recipe.dislike_count - 1 : recipe.dislike_count + 1,
              like_count: recipe.isLiked ? recipe.like_count - 1 : recipe.like_count,
              isDisliked: !isDisliked,
              isLiked: false,
            };
          }
          return recipe;
        })
      );

      const response = await fetch(`http://localhost:1240/recipes/${recipeId}/dislike`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update dislike count');
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // Function to generate and download the PDF
  const downloadRecipePDF = async (recipe) => {
    const doc = new jsPDF();

    // Fetch the image and convert it to Base64
    const loadImageAsBase64 = (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Enable cross-origin to avoid issues
        img.src = url;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg");
          resolve(dataURL);
        };
        img.onerror = (err) => reject(err);
      });
    };

    try {
      // Convert the recipe image URL to Base64
      const imageData = await loadImageAsBase64(recipe.image_link);

      // Add the image to the PDF
      doc.addImage(imageData, "JPEG", 10, 10, 50, 50); // Adjust position and size

      // Add recipe details
      doc.setFontSize(18);
      doc.text(recipe.recipe_name, 70, 20);
      doc.setFontSize(12);
      doc.text(`Cuisine: ${recipe.cuisine}`, 10, 70);
      doc.text(`Calories: ${recipe.calories} kcal`, 10, 80);
      doc.text(`Number of Servings: ${recipe.no_of_servings}`, 10, 90);
      doc.text(`Diet Type: ${recipe.diet_type}`, 10, 100);
      doc.text(`General Pricing: $${recipe.general_pricing}`, 10, 110);
      doc.text('Ingredients:', 10, 120);

      recipe.ingredient_list.forEach((ingredient, index) => {
        doc.text(`${index + 1}. ${ingredient}`, 15, 130 + index * 10);
      });

      doc.text('Procedure:', 10, 140 + recipe.ingredient_list.length * 10);
      doc.text(recipe.recipe_procedure.instructions, 10, 150 + recipe.ingredient_list.length * 10, {
        maxWidth: 190,
      });

      doc.text(`Likes: ${recipe.like_count}`, 10, 160 + recipe.ingredient_list.length * 10);
      doc.text(`Dislikes: ${recipe.dislike_count}`, 10, 170 + recipe.ingredient_list.length * 10);

      // Save the PDF
      doc.save(`${recipe.recipe_name}.pdf`);
    } catch (err) {
      console.error("Error generating PDF:", err);
    }
  };

  // Filtered recipes based on the current filter
  const filteredRecipes = recipes.filter((recipe) => {
    if (filter === 'veg') return recipe.diet_type === 'veg';
    if (filter === 'nonveg') return recipe.diet_type === 'non-veg';
    return true; // Default: Show all recipes
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="recipe-list" style={{ width: '100%', padding: '0' }}>
      <div className="d-flex justify-content-between align-items-center mb-4" style={{ width: '100%' }}>
        <div>
          <h1 className="mt-4" style={{ width: '100%' }}>Recipes</h1>
          <button
            className="btn btn-secondary"
            style={{ marginTop: '10px' }}
            onClick={() => navigate('/ingredients')}
          >
            View Ingredients
          </button>
        </div>
        <select
          className="form-control"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '150px' }}
        >
          <option value="both">Show All</option>
          <option value="veg">Show Veg</option>
          <option value="nonveg">Show Non-Veg</option>
        </select>
      </div>

      <div className="recipe-card-list d-flex flex-wrap" style={{ width: '100%' }}>
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe._id.$oid}
            className="recipe-card card mb-3"
            style={{ flex: '1 1 calc(50% - 20px)', marginRight: '10px', marginBottom: '10px', cursor: 'pointer' }}
            onClick={() => navigate(`/recipe/${recipe.id}`)}
          >
            <img
              src={recipe.image_link}
              alt={recipe.recipe_name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body">
              <h5 className="card-title">{recipe.recipe_name}</h5>
              <p className="card-text">Calories: {recipe.calories} kcal</p>
              <p className="card-text">Cuisine: {recipe.cuisine}</p>
              <div className="like-dislike-section d-flex justify-content-between align-items-center mt-2">
                <button
                  className={`btn ${recipe.isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(recipe.id);
                  }}
                >
                  👍 Like ({recipe.like_count})
                </button>
                <button
                  className={`btn ${recipe.isDisliked ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDislike(recipe.id);
                  }}
                >
                  👎 Dislike ({recipe.dislike_count})
                </button>
              </div>
              <button
                className="btn btn-success mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadRecipePDF(recipe);
                }}
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
