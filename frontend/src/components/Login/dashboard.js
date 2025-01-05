import React, { useState, useEffect } from "react";
import axios from "axios";

function UserDashboard() {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve JWT from localStorage

        const likedResponse = await axios.get("http://localhost:1240/api/user/liked-recipes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const reportedResponse = await axios.get("http://localhost:1240/api/user/reported-issues", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setLikedRecipes(likedResponse.data);
        setReportedIssues(reportedResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMessage("Failed to load user data. Please try again later.");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {/* Liked Recipes Section */}
      <section className="liked-recipes">
        <h2>Liked Recipes</h2>
        {likedRecipes.length > 0 ? (
          <div className="recipe-list">
            {likedRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <img
                  src={recipe.image_link}
                  alt={recipe.recipe_name}
                  className="recipe-image"
                />
                <div className="recipe-content">
                  <h3 className="recipe-name">{recipe.recipe_name}</h3>
                  <p>
                    <strong>Cuisine:</strong> {recipe.cuisine}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't liked any recipes yet.</p>
        )}
      </section>

      {/* Reported Issues Section */}
      <section className="reported-issues">
        <h2>Reported Issues</h2>
        {reportedIssues.length > 0 ? (
          <ul className="report-list">
            {reportedIssues.map((report, index) => (
              <li key={index}>
                <p>
                  <strong>Recipe:</strong> {report.recipe_name}
                </p>
                <p>
                  <strong>Issue:</strong> {report.reports.message}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(report.reports.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't reported any issues yet.</p>
        )}
      </section>
    </div>
  );
}

export default UserDashboard;
