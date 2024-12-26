import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for navigation
import axios from "axios";

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe details
  const [error, setError] = useState(null); // State to store any error
  const [newReview, setNewReview] = useState({ reviewer: "", comment: "", rating: "" }); // State for new review
  const [searchTerm, setSearchTerm] = useState(""); // State for glossary search input
  const [glossaryResult, setGlossaryResult] = useState(null); // State for glossary search result

  useEffect(() => {
    // Fetch the recipe by ID
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`/api/recipes/${id}`); // Call backend API
        setRecipe(response.data);
      } catch (err) {
        setError(err.response ? err.response.data.message : "Error fetching recipe");
      }
    };
    fetchRecipe();
  }, [id]);

  // Handle posting a new review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/recipes/${id}/reviews`, newReview);
      setRecipe((prev) => ({
        ...prev,
        review_list: [...prev.review_list, response.data],
      }));
      setNewReview({ reviewer: "", comment: "", rating: "" }); // Reset the form
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Failed to submit review. Please try again.");
    }
  };

  // Handle glossary search
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/glossary/${searchTerm}`);
      setGlossaryResult(response.data);
    } catch (err) {
      setGlossaryResult(null);
      setError("Word not found in glossary.");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>; // Display error message
  }

  if (!recipe) {
    return <p>Loading...</p>; // Display loading message
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Left Edge: Search Bar */}
      <div style={{ flex: 1, padding: "20px" }}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search glossary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px", width: "100%" }}>
            Search
          </button>
        </form>
        {glossaryResult && (
          <div style={{ marginTop: "20px" }}>
            <h3>Glossary Result:</h3>
            <p>
              <strong>Word:</strong> {glossaryResult.word}
            </p>
            <p>
              <strong>Definition:</strong> {glossaryResult.definition}
            </p>
          </div>
        )}
      </div>

      {/* Center: Recipe Details */}
      <div style={{ flex: 3, padding: "20px" }}>
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
        <p>{recipe.recipe_procedure}</p>
        <h2>Reviews</h2>
        <ul>
          {recipe.review_list.map((review, index) => (
            <li key={index}>
              <strong>{review.reviewer}</strong>: {review.comment} (Rating: {review.rating}/5)
            </li>
          ))}
        </ul>
      </div>

      {/* Right Edge: Add Review */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h3>Add a Review</h3>
        <form onSubmit={handleReviewSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={newReview.reviewer}
            onChange={(e) => setNewReview((prev) => ({ ...prev, reviewer: e.target.value }))}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <textarea
            placeholder="Your Review"
            value={newReview.comment}
            onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          ></textarea>
          <input
            type="number"
            placeholder="Rating (1-5)"
            value={newReview.rating}
            onChange={(e) => setNewReview((prev) => ({ ...prev, rating: e.target.value }))}
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
          <button type="submit" style={{ padding: "10px", width: "100%" }}>
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeDetails;
