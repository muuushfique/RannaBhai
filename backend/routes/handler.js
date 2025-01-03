const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas')
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
    res.send(userData)

    
})

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

module.exports = router;