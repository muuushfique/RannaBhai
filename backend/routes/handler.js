const express = require('express');

const router = express.Router();
const schemas = require('../models/schemas')
const controller = require('../controllers/controller')
const Recipe = schemas.Recipe; 

router.get('/tweets', (req, res) => {
    const str = [
        {
            "name": "Codr Kai",
            "msg": "This is my first tweet!",
            "username": "codrkai"
        },
        {
            "name": "Samantha Kai",
            "msg": "React JS is so simple!",
            "username": "samanthakai"
        },
        {
            "name": "John K",
            "msg": "Sweep the leg!",
            "username": "johnk"
        }
    ];
    res.end(JSON.stringify(str));
});

let issues = [
    {
        id: 1,
        title: "Broken Streetlights",
        description: "Several streetlights are broken in downtown.",
        upvotes: 20,
        downvotes: 5,
        comments: 10,
        location: "Downtown"
    },
    {
        id: 2,
        title: "Potholes on Main Road",
        description: "Dangerous potholes on the main road need fixing.",
        upvotes: 50,
        downvotes: 3,
        comments: 25,
        location: "Main Road"
    }
];

router.get('/govt-issues', (req, res) => {
    res.json(issues);
});

router.post('/govt-issues', (req, res) => {
    const newIssue = {
        id: issues.length + 1, // Generate a unique ID
        title: req.body.title,
        description: req.body.description,
        upvotes: req.body.upvotes || 0, // Default to 0 if not provided
        downvotes: req.body.downvotes || 0, // Default to 0 if not provided
        comments: req.body.comments || 0, // Default to 0 if not provided
        location: req.body.location || "Unknown"
    };

    issues.push(newIssue);
    res.status(201).json({ message: "Issue added successfully!", issue: newIssue });
});

router.post('/addTweet', (req, res) => {
    res.end('NA');
});

let currentIssues = [
    {
        id: 1,
        title: "Climate Change Action Needed",
        description: "Immediate action is required to combat climate change.",
        urgency: "High",
        location: "Global"
    },
    {
        id: 2,
        title: "Homelessness in Urban Areas",
        description: "Increasing homelessness in cities is a major concern.",
        urgency: "Medium",
        location: "Urban Areas"
    }
];



router.delete('/current-issues/:id', (req, res) => {
    const { id } = req.params;
    const issueIndex = currentIssues.findIndex(issue => issue.id == id);

    if (issueIndex !== -1) {
        currentIssues.splice(issueIndex, 1);
        res.json({ message: "Current issue deleted successfully!" });
    } else {
        res.status(404).json({ message: "Current issue not found" });
    }
});

// Route to update a current issue by ID
router.put('/current-issues/:id', (req, res) => {
    const { id } = req.params;
    const issueIndex = currentIssues.findIndex(issue => issue.id == id);

    if (issueIndex !== -1) {
        const updatedIssue = {
            id: currentIssues[issueIndex].id,
            title: req.body.title || currentIssues[issueIndex].title,
            description: req.body.description || currentIssues[issueIndex].description,
            urgency: req.body.urgency || currentIssues[issueIndex].urgency,
            location: req.body.location || currentIssues[issueIndex].location
        };

        currentIssues[issueIndex] = updatedIssue;
        res.json({ message: "Issue updated successfully!", issue: updatedIssue });
    } else {
        res.status(404).json({ message: "Current issue not found" });
    }
});


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
            "username": "Bret",
            "email": "Sincere@april.biz",
            "address": {
              "street": "Kulas Light",
              "suite": "Apt. 556",
              "city": "Gwenborough",
              "zipcode": "92998-3874",
              "geo": {
                "lat": "-37.3159",
                "lng": "81.1496"
              }
            },
            "phone": "1-770-736-8031 x56442",
            "website": "hildegard.org",
            "company": {
              "name": "Romaguera-Crona",
              "catchPhrase": "Multi-layered client-server neural-net",
              "bs": "harness real-time e-markets"
            }
          },
          {
            "id": 2,
            "name": "Ervin Howell",
            "username": "Antonette",
            "email": "Shanna@melissa.tv",
            "address": {
              "street": "Victor Plains",
              "suite": "Suite 879",
              "city": "Wisokyburgh",
              "zipcode": "90566-7771",
              "geo": {
                "lat": "-43.9509",
                "lng": "-34.4618"
              }
            },
            "phone": "010-692-6593 x09125",
            "website": "anastasia.net",
            "company": {
              "name": "Deckow-Crist",
              "catchPhrase": "Proactive didactic contingency",
              "bs": "synergize scalable supply-chains"
            }
          },
          {
            "id": 3,
            "name": "Clementine Bauch",
            "username": "Samantha",
            "email": "Nathan@yesenia.net",
            "address": {
              "street": "Douglas Extension",
              "suite": "Suite 847",
              "city": "McKenziehaven",
              "zipcode": "59590-4157",
              "geo": {
                "lat": "-68.6102",
                "lng": "-47.0653"
              }
            },
            "phone": "1-463-123-4447",
            "website": "ramiro.info",
            "company": {
              "name": "Romaguera-Jacobson",
              "catchPhrase": "Face to face bifurcated interface",
              "bs": "e-enable strategic applications"
            }
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


//Search for a recipe by name
router.get('/search', async (req, res) => {
    try {
      const { q } = req.query; // Extract the search query
  
      // Validate the search query
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Invalid search query' });
      }
  
      console.log(`Searching for recipe: ${q}`); // Log the search query
  
      // Perform a case-insensitive search
      const recipe = await Recipe.findOne({ recipe_name: { $regex: new RegExp(`^${q}$`, 'i') } });
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
  
      res.json(recipe); // Return the recipe if found
    } catch (error) {
      console.error('Error fetching recipe:', error);
      res.status(500).json({ message: `Error searching for recipe: ${error.message}` });
    }
  });


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