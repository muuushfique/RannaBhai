import React, { useState, useEffect } from "react";
import axios from "axios";
import "./../Customcss/ReportRecipe.css";

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [reporting, setReporting] = useState(null);
  const [reportMessage, setReportMessage] = useState("");
  const [submissionMessage, setSubmissionMessage] = useState("");

  // Fetch all recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:1240/api/all-recipes");
        setRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Handle report submission
  const handleReport = async (recipeId) => {
    try {
      if (!reportMessage.trim()) {
        setSubmissionMessage("Please provide a valid message before submitting.");
        return;
      }

      await axios.post(`http://localhost:1240/api/recipe/report/${recipeId}`, {
        reportMessage,
      });

      setSubmissionMessage("We will work on this. Please stay with us!");
      setReporting(null); // Close dropdown
      setReportMessage(""); // Clear the message
    } catch (error) {
      console.error("Error reporting recipe:", error);
      setSubmissionMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="all-recipes">
      <h1 className="title">All Recipes</h1>
      {submissionMessage && (
        <div className="submission-message">{submissionMessage}</div>
      )}
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img
              src={recipe.image_link}
              alt={recipe.recipe_name}
              className="recipe-image"
            />
            <div className="recipe-content">
              <h3 className="recipe-name">{recipe.recipe_name}</h3>
              <p className="recipe-info">
                <strong>Cuisine:</strong> {recipe.cuisine}
              </p>
              <p className="recipe-info">
                <strong>Diet:</strong> {recipe.diet_type}
              </p>
              <div className="report-section">
                <button
                  className="btn-report"
                  onClick={() =>
                    reporting === recipe.id
                      ? setReporting(null)
                      : setReporting(recipe.id)
                  }
                >
                  Report
                </button>
                {reporting === recipe.id && (
                  <div className="report-dropdown">
                    <textarea
                      value={reportMessage}
                      onChange={(e) => setReportMessage(e.target.value)}
                      placeholder="Explain your issue here..."
                      rows="3"
                    />
                    <button
                      className="btn-submit-report"
                      onClick={() => handleReport(recipe.id)}
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllRecipes;
