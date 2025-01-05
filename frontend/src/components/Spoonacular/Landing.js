import React from "react";
import { useNavigate } from "react-router-dom";
import './../../Customcss/Landing.css';

function SpoonacularLanding() {
  const navigate = useNavigate();

  return (
    <div className="spoonacular-landing">
      <h1>Welcome to Spoonacular</h1>
      <p>Discover amazing recipes or let us surprise you with a random dish!</p>
      <div className="button-group">
        <button
          className="option-button"
          onClick={() => navigate("/spoonacular")}
        >
          View All Recipes
        </button>
        <button
          className="option-button"
          onClick={() => navigate("/random-recipe")}
        >
          Try Random Recipe Generator
        </button>
      </div>
    </div>
  );
}

export default SpoonacularLanding;
