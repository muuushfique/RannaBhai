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

//ammarah
router.post('/recipe/:id/reviews', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        recipe.review_list.push(req.body); // Add the new review to the review_list
        await recipe.save(); // Save the updated recipe
        res.status(201).json(req.body); // Return the new review
    } catch (error) {
        console.error('Error posting review:', error);
        res.status(500).json({ message: 'Error posting review' });
    }
});

// Search by recipe name
router.get('/search-recipe-name', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ recipe_name: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
  
  // Search by ingredient
  router.get('/search-ingredient', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ ingredient_list: { $elemMatch: { $regex: new RegExp(`^${query}$`, 'i') } } });
    res.json(recipes);
  });
  
  // Search by cuisine
  router.get('/search-cuisine', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ cuisine: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
  
  // Search by diet type
  router.get('/search-diet-type', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ diet_type: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
// Search by calories
router.get('/search-calories', async (req, res) => {
    const query = req.query.q;
    try {
      const recipes = await Recipe.find({ calories: query }); // Use exact match for calories
      res.json(recipes);
    } catch (error) {
      console.error('Error searching by calories:', error);
      res.status(500).json({ message: 'Error searching by calories' });
    }
  });
  //ammarah

router.post('/recipes/:id/like', async (req, res) => {
    
    const recipeId = req.params.id;
    await Recipe.updateOne({ 'id': recipeId }, { $inc: { like_count: 1 } });
    res.status(200).send('Like updated');
  });
const schemas = require('../models/schemas')
const controller = require('../controllers/controller')
const Recipe = schemas.Recipe; 
const User = schemas.User;

//for contact us page
router.post('/contact', async (req, res) => {
    const {email, website, message} = req.body
    
    const contactData = {email: email, website: website, message:message}
    const newContact = new schemas.Contact(contactData)
    const saveContact = await newContact.save()
    if (saveContact) {
        res.send('Message sent. Thank you.')
    }
    else{
        res.send('Failed to send message')
    }
    res.end()
})

router.get('/users', (req, res) => {
    const userData = 
    [
        {
            "id": 1,
            "name": "Leanne Graham",
            "website": "yahoo.com",
          },
          {
            "id": 2,
            "name": "Ervin Howell",
            "website": "youtube.com",
          },
          {
            "id": 3,
            "name": "Clementine Bauch",
            "website": "google.com",
          },
    ]
    res.send(userData)})

router.post('/recipes/:id/dislike', async (req, res) => {
    

    const recipeId = req.params.id;
    await Recipe.updateOne({ 'id': recipeId }, { $inc: { dislike_count: 1 } });
    res.status(200).send('Dislike updated');
  });

router.get('/health', async (req, res) => {
    try {
        // Fetch all recommendations from the HealthRecom collection
        const recommendations = await schemas.Recommendations.find();
        
        // Send the recommendations as a response
        res.json(recommendations);
    } catch (error) {
        console.error('Error fetching health recommendations:', error);
        res.status(500).json({ message: 'Failed to fetch health recommendations.' });
    }
});

router.get('/recipe/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id); // Fetch the recipe by ID
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe); // Return the recipe if found
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Error fetching recipe' });
    }
});

router.post('/recipe/:id/reviews', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        recipe.review_list.push(req.body); // Add the new review to the review_list
        await recipe.save(); // Save the updated recipe
        res.status(201).json(req.body); // Return the new review
    } catch (error) {
        console.error('Error posting review:', error);
        res.status(500).json({ message: 'Error posting review' });
    }
});
router.get('/glossary', async (req, res) => {
  try {
    const glossaryTerms = await schemas.CookingGlossary.find(); // Fetch all glossary terms
    res.json(glossaryTerms); // Send the glossary terms as a response
  } catch (error) {
    console.error('Error fetching glossary terms:', error);
    res.status(500).json({ message})
  }
})


// Search by recipe name
router.get('/search-recipe-name', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ recipe_name: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
  
  // Search by ingredient
  router.get('/search-ingredient', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ ingredient_list: { $elemMatch: { $regex: new RegExp(`^${query}$`, 'i') } } });
    res.json(recipes);
  });
  
  // Search by cuisine
  router.get('/search-cuisine', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ cuisine: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
  
  // Search by diet type
  router.get('/search-diet-type', async (req, res) => {
    const query = req.query.q;
    const recipes = await Recipe.find({ diet_type: { $regex: new RegExp(`^${query}$`, 'i') } });
    res.json(recipes);
  });
// Search by calories
router.get('/search-calories', async (req, res) => {
    const query = req.query.q;
    try {
      const recipes = await Recipe.find({ calories: query }); // Use exact match for calories
      res.json(recipes);
    } catch (error) {
      console.error('Error searching by calories:', error);
      res.status(500).json({ message: 'Error searching by calories' });
    }
  });
//TrendingRecipe
router.get('/api/trending-recipes', async (req, res) => {
  try {
      // Use the Recipe model directly
      const recipes = await Recipe.find({})
          .sort({ like_count: -1 }) // Sort by like_count in descending order
          .limit(3); // Fetch top 3 recipes

      res.status(200).json(recipes);
  } catch (error) {
      console.error("Error fetching trending recipes:", error);
      res.status(500).send("Internal Server Error");
  }
});

router.put('/api/recipe/vote/:id', async (req, res) => {
  try {
    const { id } = req.params; // Recipe ID from the URL
    const { like_count, dislike_count } = req.body; // Updated counts from the frontend

    // Convert the `id` to an integer (int32)
    const intId = parseInt(id, 10);

    // Update the recipe document by its `id` field
    const updatedRecipe = await schemas.Recipe.findOneAndUpdate(
      { id: intId }, // Match by `id` field as an integer
      { $set: { like_count, dislike_count } }, // Set the updated counts
      { new: true } // Return the updated document
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json(updatedRecipe); // Return the updated recipe
  } catch (error) {
    console.error("Error updating recipe:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch all recipes
router.get('/api/all-recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching all recipes:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Submit a report for a recipe
router.post('/api/recipe/report/:id', async (req, res) => {
  try {
    const { id } = req.params; // Recipe ID from the URL
    const { reportMessage } = req.body; // Report message from the frontend

    if (!reportMessage) {
      return res.status(400).json({ message: "Report message is required." });
    }

    const intId = parseInt(id, 10); // Convert ID to an integer

    const updatedRecipe = await schemas.Recipe.findOneAndUpdate(
      { id: intId },
      { $push: { reports: { message: reportMessage, date: new Date() } } }, // Add the report
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.json({ message: "Report submitted successfully." });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Signup route
router.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Error creating user" });
  }
});

// Login route
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, "your_secret_key", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "your_secret_key", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get("/api/user/dashboard", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  // Fetch user-specific data
  const likedRecipes = await Recipe.find({ liked_by: userId });
  const reportedIssues = await Recipe.aggregate([
    { $unwind: "$reports" },
    { $match: { "reports.user_id": userId } },
  ]);

  res.json({ likedRecipes, reportedIssues });
});

// Fetch liked recipes for a logged-in user
router.get('/api/user/liked-recipes', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from JWT token

    const likedRecipes = await Recipe.find({ liked_by: userId }); // Recipes liked by the user
    res.status(200).json(likedRecipes);
  } catch (error) {
    console.error("Error fetching liked recipes:", error);
    res.status(500).json({ message: "Failed to fetch liked recipes" });
  }
});

// Fetch reported issues for a logged-in user
router.get('/api/user/reported-issues', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract user ID from JWT token

    const reportedIssues = await Recipe.aggregate([
      { $unwind: "$reports" }, // Deconstruct the reports array
      { $match: { "reports.user_id": userId } }, // Match reports by user ID
      {
        $project: {
          recipe_name: 1,
          "reports.message": 1,
          "reports.date": 1,
        },
      },
    ]);

    res.status(200).json(reportedIssues);
  } catch (error) {
    console.error("Error fetching reported issues:", error);
    res.status(500).json({ message: "Failed to fetch reported issues" });
  }
});

//Admin Panel
// Fetch all recipes
router.get('/api/admin/recipes', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    res.status(200).json(recipes);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Error fetching recipes" });
  }
});

// Fetch all reports
router.get('/api/admin/reports', authenticateToken, async (req, res) => {
  try {
    const reports = await Recipe.aggregate([
      { $unwind: "$reports" },
      {
        $project: {
          recipe_name: 1,
          "reports.message": 1,
          "reports.date": 1,
          "reports.user_id": 1,
        },
      },
    ]);
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});

// Delete a recipe by ID
router.delete('/api/admin/recipe/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Error deleting recipe" });
  }
});

//for spoonacular
router.get("/api/recipe-search", async (req, res) => {
  const { ingredients } = req.query; // Ingredients passed in the query string
  const apiKey = process.env.SPOONACULAR_API_KEY;

  try {
    const response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

module.exports = router;


//Ipsit
// Route to fetch nearby grocery stores
router.get("/stores", async (req, res) => {
  const { latitude, longitude, radius } = req.query;

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const rad = parseFloat(radius);

  if (!lat || !lon || !rad) {
    return res.status(400).json({ error: "Invalid or missing query parameters." });
  }

  const stores = await schemas.GroceryStore.find();
  
  res.json(stores);
});

//recipe of the day
// Function to get a random recipe
const getRandomRecipe = async () => {
  const recipeCount = await Recipe.countDocuments();
  const randomIndex = Math.floor(Math.random() * recipeCount);
  console.log(randomIndex)
  const recipe = await Recipe.findOne().skip(randomIndex); // Randomly select a recipe
  return recipe;
};

// Route to get the "Recipe of the Day"(Ipsit)
router.get("/recipe-of-the-day", async (req, res) => {
  try {
    console.log("Somossa ache")
    const today = new Date();
    console.log(today)
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    console.log(currentDate)
  const seed = currentDate.getFullYear() * 10000 +
    (currentDate.getMonth() + 1) * 100 +
    currentDate.getDate();
    const allRecipe = await Recipe.find({});
    // console.log(allRecipe)
  const recipeIndex = seed % allRecipe.length;
  const recipe = allRecipe[recipeIndex];

  console.log(recipe)
  console.log("Ipsit")
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Recipe of the Day" });
  }
});  //end

//faq and meal-planning
router.post('/add-new-faq', controller.add_new_faq)
router.get('/faqs', controller.get_all_faq);
router.delete('/delete-faq/:id', controller.delete_faq);
router.put('/update-faq/:id', controller.update_faq);
router.post('/add-new-meal', controller.add_new_meal);
router.get('/meals', controller.get_all_meals);
router.delete('/delete-meal/:id', controller.delete_meal);
router.put('/update-meal/:id', controller.update_meal);


// Get About Us content
router.get('/about-us', async (req, res) => {
  try {
    const aboutContent = await schemas.About.findOne();
    res.status(200).json(aboutContent);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch About Us content.' });
  }
});


// Submit a new recipe
router.post('/submit-recipe', async (req, res) => {
  try {
    const {
      recipe_name,
      no_of_servings,
      ingredient_list,
      cuisine,
      diet_type,
      general_pricing,
      recipe_procedure,
      image_link,
      calories,
    } = req.body;

    const newRecipe = new Recipe({
      recipe_name,
      no_of_servings,
      ingredient_list: ingredient_list.split(',').map((item) => item.trim()),
      cuisine,
      diet_type,
      general_pricing,
      recipe_procedure,
      image_link,
      calories,
      review_list: [], // Empty initially; will be updated by users later.
    });

    await newRecipe.save();
    res.status(201).send('Recipe submitted successfully');
  } catch (error) {
    console.error('Error submitting recipe:', error);
    res.status(500).send('Failed to submit recipe');
  }
});
//End of Ipsit's code
module.exports = router;
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
