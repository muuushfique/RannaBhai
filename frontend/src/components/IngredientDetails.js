import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function IngredientDetails() {
  const { id } = useParams(); 
  console.log(id)
  const navigate = useNavigate(); 
  const [ingredient, setIngredient] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchIngredientDetails = async () => {
      try {
        console.log(`Fetching details for ingredient ID: ${id}`);
        const response = await fetch(`http://localhost:1240/Ingredients/${id}`);
        console.log(response)
        if (!response.ok) {
          throw new Error('Failed to fetch ingredient details');
        }
        const data = await response.json();
        setIngredient(data); 
      } catch (err) {
        console.error(err.message);
        setError(err.message); 
      } finally {
        setLoading(false); 
      }
    };
    fetchIngredientDetails();
  }, [id]);

  
  if (loading) {
    return <p>Loading ingredient details...</p>;
  }

  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  //ingredient details
  return (
    <div className="ingredient-details">
      <h1>{ingredient.ingredient}</h1>
      <p><strong>Category:</strong> {ingredient.category}</p>
      <p><strong>Calories:</strong> {ingredient.nutrition.calories}</p>
      <p><strong>Protein:</strong> {ingredient.nutrition.protein}g</p>
      <p><strong>Carbohydrates:</strong> {ingredient.nutrition.carbohydrates}g</p>
      <p><strong>Fats:</strong> {ingredient.nutrition.fats}g</p>
      <p><strong>Fiber:</strong> {ingredient.nutrition.fiber}g</p>
      <p><strong>Calcium:</strong> {ingredient.nutrition.calcium}mg</p>
      <p><strong>Minerals:</strong> {ingredient.nutrition.minerals}mg</p>
      <button onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );
}

export default IngredientDetails;
