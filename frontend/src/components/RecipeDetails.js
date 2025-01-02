import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe details
  const [error, setError] = useState(null); // State to store any error
  const [loading, setLoading] = useState(true); // State to manage loading
  const [newReview, setNewReview] = useState({ reviewer: "", rating: 1, comment: "" });

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

// Handle new review submission
const handleReviewSubmit = async (e) => {
  e.preventDefault();
  try {
      const response = await axios.post(`http://localhost:1240/recipe/${id}/reviews`, newReview);
      setRecipe((prevRecipe) => ({
          ...prevRecipe,
          review_list: [...prevRecipe.review_list, response.data],
      }));
      setNewReview({ reviewer: "", rating: 1, comment: "" }); // Reset the form
  } catch (err) {
      console.error('Error posting review:', err);
      setError('Failed to post review. Please try again.');
  }
};
// Handle input changes for the review form
const handleInputChange = (e) => {
  const { name, value } = e.target;
  setNewReview((prevReview) => ({
    ...prevReview,
    [name]: value,
  }));
};
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
      {/* Add the "Search Glossary" Link */}
      <div style={{ margin: "20px 0" }}>
      <Link to="/glossary" style={{ textDecoration: "none", color: "blue", fontWeight: "bold" }}>
  Search Glossary
    </Link>
      </div>
      <h2>Post a Review</h2>
      
      <form onSubmit={handleReviewSubmit}>
        <input
          type="text"
          name="reviewer"
          placeholder="Your Name"
          value={newReview.reviewer}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="rating"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={handleInputChange}
          min="1"
          max="5"
          required
        />
        <textarea
          name="comment"
          placeholder="Your Review"
          value={newReview.comment}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit Review</button>
      </form>
      <h2>Reviews</h2>
      
      <div>
      
      
        {recipe.review_list.map((review, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p>
              <strong>{review.reviewer}</strong> (Rating: {review.rating}/5)
            </p>
            <p>{review.comment}</p>
            
          </div>
          
        ))}
      </div>
    </div>
    
  );
  
};

export default RecipeDetails;