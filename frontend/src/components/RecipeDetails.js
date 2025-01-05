import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom"; 
import axios from "axios";
import "./RecipeDetails.css";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const RecipeDetails = () => {
  const { id } = useParams(); // Get the recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State to store recipe details
  const [error, setError] = useState(null); // State to store any error
  const [loading, setLoading] = useState(true); // State to manage loading
  const [newReview, setNewReview] = useState({ reviewer: "", rating: 1, comment: "" });
  const [isCopied, setIsCopied] = useState(false);
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
// Copy recipe URL to clipboard
const copyToClipboard = () => {
  const recipeUrl = window.location.href; // Current page URL
  navigator.clipboard.writeText(recipeUrl).then(() => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
  });
};
// Conditional rendering
if (loading) {
  return <p>Loading...</p>; // Show loading message while fetching data
}

if (error) {
  return <p style={{ color: "red" }}>{error}</p>; // Display error message if there's an error
}

if (!recipe) {
  return <p>Recipe not found.</p>; // Handle case where recipe is not found
}

const recipeUrl = window.location.href; // Current page URL
const shareText = `Check out this recipe: ${recipe.recipe_name}`;

return (
  <div className="faq-container">
    <h1
      className="faq-title"
      style={{
        backgroundImage: `url(${recipe.image_link})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "800px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >{recipe.recipe_name}</h1>
    <div className="faq-list">
      {/* Recipe Details */}
      <div className="faq-item">
        <div className="translucent-box">
          <h2 className="faq-question">Details</h2>
          <p className="faq-answer">
            <strong>No. of Servings:</strong> {recipe.no_of_servings}
          </p>
          <p className="faq-answer">
            <strong>Cuisine:</strong> {recipe.cuisine}
          </p>
          <p className="faq-answer">
            <strong>Diet Type:</strong> {recipe.diet_type}
          </p>
          <p className="faq-answer">
            <strong>General Pricing:</strong> ${recipe.general_pricing}
          </p>
        </div>
      </div>

      {/* Ingredients */}
      <div className="faq-item">
        <div className="translucent-box">
          <h2 className="faq-question">Ingredients</h2>
          <ul>
            {recipe.ingredient_list.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Procedure */}
      <div className="faq-item">
        <div className="translucent-box">
          {/*<h2 className="faq-question">Procedure</h2>*/}
          <p className="faq-answer">
            <strong>From:</strong> {recipe.recipe_procedure.from}
          </p>
          <p className="faq-answer">
            <strong>By:</strong> {recipe.recipe_procedure.by}
          </p>
          <p className="faq-answer">
            <strong>Instructions:</strong> {recipe.recipe_procedure.instructions}
          </p>
        </div>
      </div>

      {/* Reviews */}
      <div className="faq-item">
        <div className="translucent-box">
          <h2 className="faq-question">Reviews</h2>
          <ul>
            {recipe.review_list.map((review, index) => (
              <li key={index}>
                <p>
                  <strong>{review.reviewer} (Rating: {review.rating}/5)</strong> 
                </p>
                <p>
                {review.comment} 
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Post a Review */}
      <div className="faq-item">
        <div className="translucent-box">
          <h2 className="faq-question">Post a Review</h2>
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
              placeholder="Your comment"
              value={newReview.comment}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit">Submit Review</button>
          </form>
        </div>
      </div>
      {/* Social Share Buttons */}
      <div className="faq-item">
          <div className="translucent-box">
            <h2 className="faq-question">Share This Recipe</h2>
            <div className="social-share-buttons">
              <FacebookShareButton url={recipeUrl} quote={shareText}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TwitterShareButton url={recipeUrl} title={shareText}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
              <WhatsappShareButton url={recipeUrl} title={shareText}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </div>
            <button onClick={copyToClipboard}>
              {isCopied ? "Link Copied!" : "Copy Recipe Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default RecipeDetails;