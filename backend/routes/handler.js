const express = require('express');
const router = express.Router();
const { Recipe, Ingredient } = require('../models/schemas'); // Import Recipe model

// Get all recipes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Fetch all recipes
        res.json(recipes); // Send the recipes as a response
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes' });
    }
});

// Get a single recipe by ID
router.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ id: req.params.id }); // Find recipe by ID
        if (recipe) {
            res.json(recipe); // Send the recipe as a response
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Error fetching recipe' });
    }
});

// Add a new recipe
router.post('/recipes', async (req, res) => {
    const {
        id,
        recipe_name,
        no_of_servings,
        ingredient_list,
        cuisine,
        diet_type,
        general_pricing,
        recipe_procedure,
        image_link,
        calories,
        review_list,
        like_count,
        dislike_count,
    } = req.body;

    const newRecipe = new Recipe({
        id,
        recipe_name,
        no_of_servings,
        ingredient_list,
        cuisine,
        diet_type,
        general_pricing,
        recipe_procedure,
        image_link,
        calories,
        review_list,
        like_count,
        dislike_count,
    });

    try {
        const savedRecipe = await newRecipe.save(); // Save to the database
        res.status(201).json({ message: 'Recipe added successfully!', recipe: savedRecipe });
    } catch (error) {
        console.error('Error adding recipe:', error);
        res.status(500).json({ message: 'Error adding recipe' });
    }
});

// Update a recipe by ID
router.put('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ id: req.params.id }); // Find recipe by ID
        if (recipe) {
            const updatedFields = req.body; // Get updated fields from the request
            Object.assign(recipe, updatedFields); // Update the recipe
            const updatedRecipe = await recipe.save(); // Save the updated recipe
            res.json({ message: 'Recipe updated successfully!', recipe: updatedRecipe });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error updating recipe:', error);
        res.status(500).json({ message: 'Error updating recipe' });
    }
});

// Delete a recipe by ID
router.delete('/recipes/:id', async (req, res) => {
    try {
        const result = await Recipe.deleteOne({ id: req.params.id }); // Delete recipe by ID
        if (result.deletedCount > 0) {
            res.json({ message: 'Recipe deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
});

router.post('/recipes/:id/like', async (req, res) => {
    
    const recipeId = req.params.id;
    await Recipe.updateOne({ 'id': recipeId }, { $inc: { like_count: 1 } });
    res.status(200).send('Like updated');
  });

router.post('/recipes/:id/dislike', async (req, res) => {
    

    const recipeId = req.params.id;
    await Recipe.updateOne({ 'id': recipeId }, { $inc: { dislike_count: 1 } });
    res.status(200).send('Dislike updated');
  });


router.get('/Ingredients', async (req, res) => {
    try {
        console.log('hit')
        const { search, category } = req.query; // Extract query parameters for filtering

        // Query for filtering
        const filter = {};
        if (search) {
            filter.ingredient = { $regex: search, $options: 'i' }; // Case-insensitive search
        }
        if (category && category !== 'both') {
            filter.category = category; // Filter by category if provided
        }

        const ingredients = await Ingredient.find(filter); // Fetch ingredients with filters
        res.json(ingredients);
    } catch (error) {
        console.error('Error fetching ingredients:', error);
        res.status(500).json({ message: 'Error fetching Ingredients' });
    }
});

// Get a single ingredient by ID
router.get('/Ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findOne({ id: req.params.id }); // Find ingredient by ID
        if (ingredient) {
            res.json(ingredient); // Send the ingredient as a response
        } else {
            res.status(404).json({ message: 'Ingredient not found' });
        }
    } catch (error) {
        console.error('Error fetching ingredient:', error);
        res.status(500).json({ message: 'Error fetching ingredient' });
    }
});

// Add a new ingredient
router.post('/Ingredients', async (req, res) => {
    const { id, ingredient, nutrition, category } = req.body;

    const newIngredient = new Ingredient({
        id,
        ingredient,
        nutrition,
        category,
    });

    try {
        const savedIngredient = await newIngredient.save(); // Save to the database
        res.status(201).json({ message: 'Ingredient added successfully!', ingredient: savedIngredient });
    } catch (error) {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ message: 'Error adding ingredient' });
    }
});

// Update an ingredient by ID
router.put('/Ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findOne({ id: req.params.id }); // Find ingredient by ID
        if (ingredient) {
            const updatedFields = req.body; // Get updated fields from the request
            Object.assign(ingredient, updatedFields); // Update the ingredient
            const updatedIngredient = await ingredient.save(); // Save the updated ingredient
            res.json({ message: 'Ingredient updated successfully!', ingredient: updatedIngredient });
        } else {
            res.status(404).json({ message: 'Ingredient not found' });
        }
    } catch (error) {
        console.error('Error updating ingredient:', error);
        res.status(500).json({ message: 'Error updating ingredient' });
    }
});

// Delete an ingredient by ID
router.delete('/Ingredients/:id', async (req, res) => {
    try {
        const result = await Ingredient.deleteOne({ id: req.params.id }); // Delete ingredient by ID
        if (result.deletedCount > 0) {
            res.json({ message: 'Ingredient deleted successfully!' });
        } else {
            res.status(404).json({ message: 'Ingredient not found' });
        }
    } catch (error) {
        console.error('Error deleting ingredient:', error);
        res.status(500).json({ message: 'Error deleting ingredient' });
    }
});

 ////////////
 router.get('/Ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findOne({ id: req.params.id });
        if (ingredient) res.json(ingredient);
        else res.status(404).json({ message: 'Ingredient not found' });
    } catch (error) {
        console.error('Error fetching ingredient:', error);
        res.status(500).json({ message: 'Error fetching ingredient' });
    }
});

router.get('/Ingredients/:id/nutrition', async (req, res) => {
    try {
        const ingredient = await Ingredient.findOne({ id: req.params.id }, 'nutrition');
        if (ingredient) res.json({ nutrition: ingredient.nutrition });
        else res.status(404).json({ message: 'Nutrition details not found' });
    } catch (error) {
        console.error('Error fetching nutrition data:', error);
        res.status(500).json({ message: 'Error fetching nutrition data' });
    }
});

router.put('/Ingredients/:id/nutrition', async (req, res) => {
    const { nutrition } = req.body;
    try {
        const ingredient = await Ingredient.findOne({ id: req.params.id });
        if (ingredient) {
            ingredient.nutrition = nutrition;
            const updatedIngredient = await ingredient.save();
            res.json({ message: 'Nutrition updated successfully!', ingredient: updatedIngredient });
        } else res.status(404).json({ message: 'Ingredient not found' });
    } catch (error) {
        console.error('Error updating nutrition:', error);
        res.status(500).json({ message: 'Error updating nutrition' });
    }
});

router.get('/Ingredients/:id/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({ ingredient_list: req.params.id });
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes for ingredient:', error);
        res.status(500).json({ message: 'Error fetching recipes for ingredient' });
    }
});




  


  

module.exports = router;
