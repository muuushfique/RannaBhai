import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/MealPlanner.css';

const MealPlanner = () => {
    const [targetCalories, setTargetCalories] = useState('');
    const [mealPlan, setMealPlan] = useState(null);
    const [error, setError] = useState('');
    const [meals, setMeals] = useState({
        breakfast: [],
        lunch: [],
        dinner: []
    });

    useEffect(() => {
        fetchMeals();
    }, []);

    const fetchMeals = async () => {
        try {
            const response = await axios.get('http://localhost:1240/meals');
            const categorizedMeals = {
                breakfast: response.data.filter(meal => meal.category === 'Breakfast'),
                lunch: response.data.filter(meal => meal.category === 'Lunch'),
                dinner: response.data.filter(meal => meal.category === 'Dinner')
            };
            setMeals(categorizedMeals);
        } catch (err) {
            setError('Failed to load meals. Please try again later.');
        }
    };
    const generateMealPlan = () => {
        const calories = parseInt(targetCalories);
        if (!calories || calories < 1000 || calories > 4000) {
            setError('Please enter a target between 1000-4000 calories');
            setMealPlan(null);
            return;
        }
        setError('');

        // Distribute calories: 30% breakfast, 35% lunch, 35% dinner
        const breakfastCal = Math.floor(calories * 0.3);
        const lunchCal = Math.floor(calories * 0.35);
        const dinnerCal = Math.floor(calories * 0.35);

        // Select meals closest to target calories from fetched data
        const selectedBreakfast = meals.breakfast.reduce((prev, curr) => 
            Math.abs(curr.calories - breakfastCal) < Math.abs(prev.calories - breakfastCal) ? curr : prev
        );

        const selectedLunch = meals.lunch.reduce((prev, curr) => 
            Math.abs(curr.calories - lunchCal) < Math.abs(prev.calories - lunchCal) ? curr : prev
        );

        const selectedDinner = meals.dinner.reduce((prev, curr) => 
            Math.abs(curr.calories - dinnerCal) < Math.abs(prev.calories - dinnerCal) ? curr : prev
        );

        setMealPlan({
            breakfast: selectedBreakfast,
            lunch: selectedLunch,
            dinner: selectedDinner,
            totalCalories: selectedBreakfast.calories + selectedLunch.calories + selectedDinner.calories
        });
    };

    return (
        <div className="meal-planner-container">
            <div className="meal-planner-header">
                <h1>Daily Meal Planner</h1>
                <p>Enter your target calories to get a personalized meal plan</p>
                
                <div className="meal-planner-input">
                    <input
                        type="number"
                        value={targetCalories}
                        onChange={(e) => setTargetCalories(e.target.value)}
                        placeholder="Target calories (1000-4000)"
                        min="1000"
                        max="4000"
                    />
                    <button onClick={generateMealPlan}>Generate Plan</button>
                </div>
                
                {error && <p className="meal-planner-error">{error}</p>}
            </div>

            {mealPlan && (
                <div className="meal-plan-results">
                    <div className="meal-plan-summary">
                        <h2>Your Daily Meal Plan</h2>
                        <p>Total Calories: {mealPlan.totalCalories}</p>
                    </div>
                    
                    <div className="meal-cards">
                        <div className="meal-card">
                            <h3>Breakfast</h3>
                            <img src={mealPlan.breakfast.image} alt={mealPlan.breakfast.name} />
                            <h4>{mealPlan.breakfast.name}</h4>
                            <p className="meal-description">{mealPlan.breakfast.description}</p>
                            <div className="meal-nutrients">
                                <span>Calories: {mealPlan.breakfast.calories}</span>
                            </div>
                        </div>

                        <div className="meal-card">
                            <h3>Lunch</h3>
                            <img src={mealPlan.lunch.image} alt={mealPlan.lunch.name} />
                            <h4>{mealPlan.lunch.name}</h4>
                            <p className="meal-description">{mealPlan.lunch.description}</p>
                            <div className="meal-nutrients">
                                <span>Calories: {mealPlan.lunch.calories}</span>
                            </div>
                        </div>

                        <div className="meal-card">
                            <h3>Dinner</h3>
                            <img src={mealPlan.dinner.image} alt={mealPlan.dinner.name} />
                            <h4>{mealPlan.dinner.name}</h4>
                            <p className="meal-description">{mealPlan.dinner.description}</p>
                            <div className="meal-nutrients">
                                <span>Calories: {mealPlan.dinner.calories}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealPlanner;