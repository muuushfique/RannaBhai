const express = require('express');
const router = express.Router();
const schemas = require('../models/schemas')
const Recipe = schemas.Recipe; 

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


module.exports = router;