import React, { useState } from 'react';
import axios from 'axios';
import '../css/SubmitRecipe.css';

const SubmitRecipe = () => {
  const [formData, setFormData] = useState({
    recipe_name: '',
    no_of_servings: '',
    ingredient_list: '',
    cuisine: '',
    diet_type: '',
    general_pricing: '',
    recipe_procedure: {
      from: '',
      by: '',
      instructions: '',
    },
    image_link: '',
    calories: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('procedure_')) {
      const field = name.split('_')[1];
      setFormData((prev) => ({
        ...prev,
        recipe_procedure: { ...prev.recipe_procedure, [field]: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1240/submit-recipe', formData);
      alert('Recipe submitted successfully!');
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to submit recipe');
    }
  };

  return (
    <div className="submit-recipe-container">
      <h1>Submit a Recipe</h1>
      <form onSubmit={handleSubmit} className="submit-recipe-form">
        <label>
          Recipe Name:
          <input
            type="text"
            name="recipe_name"
            value={formData.recipe_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Number of Servings:
          <input
            type="number"
            name="no_of_servings"
            value={formData.no_of_servings}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Ingredients (comma-separated):
          <textarea
            name="ingredient_list"
            value={formData.ingredient_list}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Cuisine:
          <input
            type="text"
            name="cuisine"
            value={formData.cuisine}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Diet Type:
          <input
            type="text"
            name="diet_type"
            value={formData.diet_type}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          General Pricing:
          <input
            type="number"
            name="general_pricing"
            value={formData.general_pricing}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Recipe Procedure:
          <input
            type="text"
            name="procedure_from"
            placeholder="From"
            value={formData.recipe_procedure.from}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="procedure_by"
            placeholder="By"
            value={formData.recipe_procedure.by}
            onChange={handleChange}
            required
          />
          <textarea
            name="procedure_instructions"
            placeholder="Instructions"
            value={formData.recipe_procedure.instructions}
            onChange={handleChange}
            required
          ></textarea>
        </label>
        <label>
          Image Link:
          <input
            type="url"
            name="image_link"
            value={formData.image_link}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Calories:
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default SubmitRecipe;
