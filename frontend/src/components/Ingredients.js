import React, { useState, useEffect } from 'react';

function Ingredients() {
  const [ingredients, setIngredients] = useState([]);
  const [filter, setFilter] = useState('both'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [nutritionSummary, setNutritionSummary] = useState(null);
  const [showCalculation, setShowCalculation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://localhost:1240/Ingredients');
        if (!response.ok) {
          throw new Error('Failed to fetch ingredients');
        }
        const data = await response.json();
        setIngredients(data);
      } catch (err) {
        console.error(err.message);
      }
    };
    fetchIngredients();
  }, []);

  //filter
  const filteredIngredients = ingredients.filter((ingredient) =>
    ingredient.ingredient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //add to calculation list
  const addIngredientToList = (ingredient) => {
    if (!selectedIngredients.some((item) => item.id === ingredient.id)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  // remove from calculation list
  const removeIngredientFromList = (id) => {
    setSelectedIngredients(selectedIngredients.filter((item) => item.id !== id));
    const updatedQuantities = { ...quantities };
    delete updatedQuantities[id];
    setQuantities(updatedQuantities);
  };

  //quantity input
  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: parseFloat(value) || 0 });
  };

  //Calculate
  const calculateNutrition = () => {
    if (selectedIngredients.length === 0) {
      setErrorMessage('No ingredient added');
      return;
    }

    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fats: 0,
      fiber: 0,
      calcium: 0,
      minerals: 0,
    };

    selectedIngredients.forEach((ingredient) => {
      const quantity = quantities[ingredient.id] || 0;
      const factor = quantity / 100; // Nutrition values are per 100 grams
      totalNutrition.calories += ingredient.nutrition.calories * factor;
      totalNutrition.protein += ingredient.nutrition.protein * factor;
      totalNutrition.carbohydrates += ingredient.nutrition.carbohydrates * factor;
      totalNutrition.fats += ingredient.nutrition.fats * factor;
      totalNutrition.fiber += ingredient.nutrition.fiber * factor;
      totalNutrition.calcium += ingredient.nutrition.calcium * factor;
      totalNutrition.minerals += ingredient.nutrition.minerals * factor;
    });

    setNutritionSummary(totalNutrition);
    setErrorMessage('');
  };

  if (selectedIngredient) {
    //ingredient Details Interface
    return (
      <div className="ingredient-details">
        <h1>{selectedIngredient.ingredient}</h1>
        <h3>Nutrition Values (Per 100g)</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Nutrient</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Calories</td>
              <td>{selectedIngredient.nutrition.calories} kcal</td>
            </tr>
            <tr>
              <td>Protein</td>
              <td>{selectedIngredient.nutrition.protein} g</td>
            </tr>
            <tr>
              <td>Carbohydrates</td>
              <td>{selectedIngredient.nutrition.carbohydrates} g</td>
            </tr>
            <tr>
              <td>Fats</td>
              <td>{selectedIngredient.nutrition.fats} g</td>
            </tr>
            <tr>
              <td>Fiber</td>
              <td>{selectedIngredient.nutrition.fiber} g</td>
            </tr>
            <tr>
              <td>Calcium</td>
              <td>{selectedIngredient.nutrition.calcium} mg</td>
            </tr>
            <tr>
              <td>Minerals</td>
              <td>{selectedIngredient.nutrition.minerals} mg</td>
            </tr>
          </tbody>
        </table>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => setSelectedIngredient(null)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="ingredients-page">
      {!showCalculation && (
        // Navbar
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
          <div className="container-fluid">
            <span className="navbar-brand">Ingredients</span>
            <div className="d-flex align-items-center">
              <input
                type="text"
                placeholder="Search ingredients"
                className="form-control me-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '300px' }}
              />
              <select
                className="form-select me-3"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="both">Show All</option>
                <option value="veg">Show Veg</option>
                <option value="non-veg">Show Non-Veg</option>
              </select>
              <button
                className="btn btn-light"
                onClick={() => setShowCalculation(true)}
              >
                Calculate Nutrition Values
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      {!showCalculation ? (
        <div className="ingredient-card-list d-flex flex-wrap mt-3">
          {ingredients
            .filter(
              (ingredient) =>
                filter === 'both' || ingredient.category === filter
            )
            .filter((ingredient) =>
              ingredient.ingredient
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            )
            .map((ingredient) => (
              <div
                key={ingredient.id}
                className="ingredient-card card mb-3"
                style={{
                  flex: '1 1 calc(50% - 20px)',
                  margin: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedIngredient(ingredient)}
              >
                <div className="card-body">
                  <h5 className="card-title">{ingredient.ingredient}</h5>
                  <p className="card-text">Category: {ingredient.category}</p>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search ingredients"
            className="form-control mb-3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Show only when searched */}
          {searchTerm && (
            <div className="ingredient-search-results">
              {filteredIngredients.map((ingredient) => (
                <div
                  key={ingredient.id}
                  className="d-flex align-items-center mb-3"
                >
                  <p className="mb-0 me-3">{ingredient.ingredient}</p>
                  <button
                    className="btn btn-success"
                    onClick={() => addIngredientToList(ingredient)}
                  >
                    Add (+)
                  </button>
                </div>
              ))}
            </div>
          )}

          {selectedIngredients.length > 0 && (
            <div className="selected-ingredients-list mt-4">
              <h2>Selected Ingredients</h2>
              {selectedIngredients.map((ingredient) => (
                <div key={ingredient.id} className="mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <p>{ingredient.ingredient}</p>
                    <button
                      className="btn btn-danger ms-3"
                      onClick={() => removeIngredientFromList(ingredient.id)}
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="number"
                    placeholder="Quantity (grams)"
                    className="form-control"
                    value={quantities[ingredient.id] || ''}
                    onChange={(e) =>
                      handleQuantityChange(ingredient.id, e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                className="btn btn-primary mt-3"
                onClick={calculateNutrition}
              >
                Submit
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="text-danger mt-3">{errorMessage}</p>
          )}

          {nutritionSummary && (
            <div className="nutrition-summary mt-5">
              <h3>Total Nutrition</h3>
              <p>
                <strong>Calories:</strong> {nutritionSummary.calories.toFixed(2)}{' '}
                kcal
              </p>
              <p>
                <strong>Protein:</strong> {nutritionSummary.protein.toFixed(2)} g
              </p>
              <p>
                <strong>Carbohydrates:</strong>{' '}
                {nutritionSummary.carbohydrates.toFixed(2)} g
              </p>
              <p>
                <strong>Fats:</strong> {nutritionSummary.fats.toFixed(2)} g
              </p>
              <p>
                <strong>Fiber:</strong> {nutritionSummary.fiber.toFixed(2)} g
              </p>
              <p>
                <strong>Calcium:</strong> {nutritionSummary.calcium.toFixed(2)}{' '}
                mg
              </p>
              <p>
                <strong>Minerals:</strong> {nutritionSummary.minerals.toFixed(2)}{' '}
                mg
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Ingredients;
