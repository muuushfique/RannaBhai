const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {
  User,
  Contact,
  Recipe,
  CookingGlossary,
  Recommendations,
  GroceryStore,
  About,
  Ingredient,
} = require('../models/schemas');

const {
  add_new_faq,
  get_all_faq,
  delete_faq,
  update_faq,
  add_new_meal,
  get_all_meals,
  delete_meal,
  update_meal,
} = require('../controllers/controller');

const JWT_SECRET = process.env.JWT_SECRET || 'rannabhai_jwt_secret_key';

function escapeRegex(str = '') {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findRecipeByParam(param) {
  if (!param) return null;
  if (mongoose.Types.ObjectId.isValid(param) && String(param).length === 24) {
    const byObjId = await Recipe.findById(param);
    if (byObjId) return byObjId;
  }
  const num = Number(param);
  if (!Number.isNaN(num)) {
    return Recipe.findOne({ id: num });
  }
  return null;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authentication required' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (!err) req.user = decoded;
    });
  }
  next();
}

// ==========================================
// RECIPES
// ==========================================
router.get(['/recipes', '/api/all-recipes'], async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1, id: 1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: err.message });
  }
});

router.get(['/recipe/:id', '/recipes/:id'], async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: err.message });
  }
});

router.get('/recipe-of-the-day', async (req, res) => {
  try {
    const allRecipes = await Recipe.find().sort({ id: 1 });
    if (!allRecipes.length) {
      return res.status(404).json({ message: 'No recipes available yet.' });
    }
    const now = new Date();
    const daySeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    const index = daySeed % allRecipes.length;
    res.json(allRecipes[index]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recipe of the day', error: err.message });
  }
});

router.get('/api/trending-recipes', async (req, res) => {
  try {
    const trending = await Recipe.find().sort({ like_count: -1, dislike_count: 1 }).limit(6);
    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trending recipes', error: err.message });
  }
});

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

    if (!recipe_name?.trim()) {
      return res.status(400).json({ message: 'Recipe name is required.' });
    }

    const latest = await Recipe.findOne().sort({ id: -1 }).select('id');
    const nextId = (latest?.id || 0) + 1;

    const normalizedIngredients = Array.isArray(ingredient_list)
      ? ingredient_list.map((s) => String(s).trim()).filter(Boolean)
      : String(ingredient_list || '')
          .split(/[\n,]/)
          .map((s) => s.trim())
          .filter(Boolean);

    const normalizedSteps = Array.isArray(recipe_procedure)
      ? recipe_procedure.map((s) => String(s).trim()).filter(Boolean)
      : String(recipe_procedure || '')
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);

    const created = await Recipe.create({
      id: nextId,
      recipe_name: recipe_name.trim(),
      no_of_servings: Number(no_of_servings) || 2,
      ingredient_list: normalizedIngredients,
      cuisine: cuisine?.trim() || 'Bangladeshi',
      diet_type: diet_type?.trim() || 'Regular',
      general_pricing: general_pricing?.trim() || '$$',
      recipe_procedure: normalizedSteps,
      image_link: image_link?.trim() || '',
      calories: Number(calories) || 350,
      like_count: 0,
      dislike_count: 0,
    });

    res.status(201).json({ message: 'Recipe submitted successfully!', recipe: created });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit recipe', error: err.message });
  }
});

router.post('/recipes/:id/like', optionalAuth, async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const delta = req.body?.delta === -1 ? -1 : 1;
    recipe.like_count = Math.max(0, (recipe.like_count || 0) + delta);

    if (req.user?.userId) {
      const uid = req.user.userId;
      if (delta === 1) {
        if (!recipe.liked_by.some((x) => String(x) === String(uid))) {
          recipe.liked_by.push(uid);
        }
      } else {
        recipe.liked_by = recipe.liked_by.filter((x) => String(x) !== String(uid));
      }
    }

    await recipe.save();
    res.json({
      like_count: recipe.like_count,
      dislike_count: recipe.dislike_count,
      recipe,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update like', error: err.message });
  }
});

router.post('/recipes/:id/dislike', optionalAuth, async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const delta = req.body?.delta === -1 ? -1 : 1;
    recipe.dislike_count = Math.max(0, (recipe.dislike_count || 0) + delta);
    await recipe.save();

    res.json({
      like_count: recipe.like_count,
      dislike_count: recipe.dislike_count,
      recipe,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update dislike', error: err.message });
  }
});

router.put('/api/recipe/vote/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { type } = req.body;
    if (type === 'like') {
      recipe.like_count = (recipe.like_count || 0) + 1;
      if (req.user?.userId && !recipe.liked_by.some((x) => String(x) === String(req.user.userId))) {
        recipe.liked_by.push(req.user.userId);
      }
    } else if (type === 'dislike') {
      recipe.dislike_count = (recipe.dislike_count || 0) + 1;
    } else {
      if (typeof req.body.like_count === 'number') recipe.like_count = Math.max(0, req.body.like_count);
      if (typeof req.body.dislike_count === 'number') recipe.dislike_count = Math.max(0, req.body.dislike_count);
    }

    await recipe.save();
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cast vote', error: err.message });
  }
});

router.post('/recipe/:id/reviews', optionalAuth, async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const comment = (req.body.comment || req.body.review || '').trim();
    const rating = Math.min(5, Math.max(1, Number(req.body.rating) || 5));
    const reviewer_name = (req.body.reviewer_name || req.user?.username || 'Home Chef').trim();

    if (!comment) {
      return res.status(400).json({ message: 'Review comment is required.' });
    }

    recipe.review_list.push({ reviewer_name, rating, comment, date: new Date() });
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
});

router.post('/api/recipe/report/:id', optionalAuth, async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const reason = (req.body.reason || '').trim();
    if (!reason) {
      return res.status(400).json({ message: 'Report reason is required.' });
    }

    recipe.reports.push({
      user_id: req.user?.userId || null,
      reporter_name: req.user?.username || 'Guest',
      reason,
      date: new Date(),
    });
    await recipe.save();
    res.status(201).json({ message: 'Report submitted successfully', recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit report', error: err.message });
  }
});

// ==========================================
// SEARCH (Partial, Regex-Safe, Deduplicated)
// ==========================================
router.get('/search-recipe-name', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const results = await Recipe.find({ recipe_name: new RegExp(escapeRegex(q), 'i') });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

router.get('/search-ingredient', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const results = await Recipe.find({ ingredient_list: new RegExp(escapeRegex(q), 'i') });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

router.get('/search-cuisine', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const results = await Recipe.find({ cuisine: new RegExp(escapeRegex(q), 'i') });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

router.get('/search-diet-type', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const results = await Recipe.find({ diet_type: new RegExp(escapeRegex(q), 'i') });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

router.get('/search-calories', async (req, res) => {
  try {
    const maxCal = Number(req.query.q);
    if (Number.isNaN(maxCal) || maxCal <= 0) return res.json([]);
    const results = await Recipe.find({ calories: { $lte: maxCal } }).sort({ calories: 1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

// ==========================================
// INGREDIENTS
// ==========================================
router.get('/Ingredients', async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'all') {
      filter.category = new RegExp(`^${escapeRegex(req.query.category)}$`, 'i');
    }
    if (req.query.q) {
      filter.ingredient = new RegExp(escapeRegex(req.query.q), 'i');
    }
    const items = await Ingredient.find(filter).sort({ id: 1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ingredients', error: err.message });
  }
});

router.get('/Ingredients/:id', async (req, res) => {
  try {
    const param = req.params.id;
    let item = null;
    if (mongoose.Types.ObjectId.isValid(param) && String(param).length === 24) {
      item = await Ingredient.findById(param);
    }
    if (!item && !Number.isNaN(Number(param))) {
      item = await Ingredient.findOne({ id: Number(param) });
    }
    if (!item) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ingredient', error: err.message });
  }
});

router.get('/Ingredients/:id/recipes', async (req, res) => {
  try {
    const param = req.params.id;
    let item = null;
    if (mongoose.Types.ObjectId.isValid(param) && String(param).length === 24) {
      item = await Ingredient.findById(param);
    }
    if (!item && !Number.isNaN(Number(param))) {
      item = await Ingredient.findOne({ id: Number(param) });
    }
    if (!item) return res.json([]);
    const matched = await Recipe.find({
      ingredient_list: new RegExp(escapeRegex(item.ingredient), 'i'),
    });
    res.json(matched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to find matching recipes', error: err.message });
  }
});

// ==========================================
// SPOONACULAR PROXY WITH AUTOMATIC LOCAL FALLBACK
// ==========================================
function mapLocalToSpoonShape(r) {
  return {
    id: `local-${r._id}`,
    localId: r._id,
    title: r.recipe_name,
    image: r.image_link,
    readyInMinutes: 30,
    servings: r.no_of_servings || 2,
    calories: r.calories || 350,
    cuisine: r.cuisine,
    diet_type: r.diet_type,
    extendedIngredients: (r.ingredient_list || []).map((ing, i) => ({
      id: `${r._id}-ing-${i}`,
      original: ing,
    })),
    instructions: (r.recipe_procedure || []).join('\n'),
    source: 'RannaBhai Kitchen',
  };
}

router.get('/api/spoonacular/search', async (req, res) => {
  const raw = (req.query.ingredients || '').trim();
  if (!raw) return res.json({ source: 'RannaBhai Kitchen', results: [] });

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/findByIngredients', {
        params: { ingredients: raw, number: 9, apiKey },
        timeout: 6000,
      });
      if (Array.isArray(response.data) && response.data.length > 0) {
        return res.json({
          source: 'Spoonacular',
          results: response.data.map((r) => ({ ...r, source: 'Spoonacular' })),
        });
      }
    } catch {
      // Fall through cleanly to local MongoDB pantry matcher
    }
  }

  try {
    const terms = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const allRecipes = await Recipe.find();
    const scored = allRecipes
      .map((r) => {
        const listLower = (r.ingredient_list || []).map((i) => i.toLowerCase());
        const matched = terms.filter((t) => listLower.some((item) => item.includes(t)));
        return {
          ...mapLocalToSpoonShape(r),
          usedIngredientCount: matched.length,
          missedIngredientCount: Math.max(0, listLower.length - matched.length),
        };
      })
      .filter((r) => r.usedIngredientCount > 0)
      .sort((a, b) => b.usedIngredientCount - a.usedIngredientCount);

    const fallback = scored.length > 0 ? scored : allRecipes.slice(0, 6).map(mapLocalToSpoonShape);
    res.json({ source: 'RannaBhai Kitchen', results: fallback });
  } catch (err) {
    res.status(500).json({ message: 'Pantry search failed', error: err.message });
  }
});

router.get('/api/spoonacular/recipe/:id', async (req, res) => {
  const { id } = req.params;
  if (id.startsWith('local-')) {
    const mongoId = id.replace('local-', '');
    const recipe = await findRecipeByParam(mongoId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    return res.json(mapLocalToSpoonShape(recipe));
  }

  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information`, {
        params: { apiKey },
        timeout: 6000,
      });
      return res.json({ ...response.data, source: 'Spoonacular' });
    } catch {
      // Fallback to local recipe if external fails
    }
  }

  const local = await findRecipeByParam(id);
  if (local) return res.json(mapLocalToSpoonShape(local));
  return res.status(404).json({ message: 'Recipe details unavailable right now.' });
});

router.get('/api/spoonacular/random', async (req, res) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;
  if (apiKey) {
    try {
      const response = await axios.get('https://api.spoonacular.com/recipes/random', {
        params: { number: 1, apiKey },
        timeout: 6000,
      });
      const rec = response.data?.recipes?.[0];
      if (rec) return res.json({ ...rec, source: 'Spoonacular' });
    } catch {
      // Fall back cleanly to a random local recipe
    }
  }

  try {
    const all = await Recipe.find();
    if (!all.length) return res.status(404).json({ message: 'No recipes available' });
    const pick = all[Math.floor(Math.random() * all.length)];
    res.json(mapLocalToSpoonShape(pick));
  } catch (err) {
    res.status(500).json({ message: 'Could not load random recipe', error: err.message });
  }
});

// ==========================================
// AUTH, USER DASHBOARD & ADMIN
// ==========================================
router.post('/api/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = jwt.sign(
      { userId: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

router.get('/api/user/me', authenticateToken, async (req, res) => {
  res.json({
    id: req.user.userId,
    username: req.user.username,
    email: req.user.email,
    isAdmin: Boolean(req.user.isAdmin),
  });
});

router.get('/api/user/liked-recipes', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ liked_by: req.user.userId });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load liked recipes', error: err.message });
  }
});

router.get('/api/user/reported-issues', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.find({ 'reports.user_id': req.user.userId });
    const issues = [];
    recipes.forEach((r) => {
      (r.reports || []).forEach((rep) => {
        if (String(rep.user_id) === String(req.user.userId)) {
          issues.push({
            _id: rep._id,
            recipeId: r._id,
            recipeName: r.recipe_name,
            reason: rep.reason,
            date: rep.date,
          });
        }
      });
    });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load reported issues', error: err.message });
  }
});

// Unified Admin endpoints
router.get('/api/admin/stats', async (req, res) => {
  try {
    const [recipes, users, contacts, ingredients, meals, faqs] = await Promise.all([
      Recipe.find(),
      User.find().select('-password'),
      Contact.find().sort({ entryDate: -1 }),
      Ingredient.countDocuments(),
      mongoose.connection.db.collection('meals').countDocuments(),
      mongoose.connection.db.collection('faqs').countDocuments(),
    ]);
    let totalLikes = 0;
    let totalReviews = 0;
    let openReports = 0;
    recipes.forEach((r) => {
      totalLikes += r.like_count || 0;
      totalReviews += (r.review_list || []).length;
      openReports += (r.reports || []).length;
    });
    res.json({
      totalRecipes: recipes.length,
      totalLikes,
      totalReviews,
      openReports,
      totalUsers: users.length,
      totalContacts: contacts.length,
      totalIngredients: ingredients,
      totalMeals: meals,
      totalFaqs: faqs,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load admin stats', error: err.message });
  }
});

router.get('/api/admin/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1, id: 1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load admin recipes', error: err.message });
  }
});

router.put('/api/admin/recipe/:id', async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

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

    if (recipe_name !== undefined) recipe.recipe_name = String(recipe_name).trim();
    if (no_of_servings !== undefined) recipe.no_of_servings = Number(no_of_servings) || 2;
    if (cuisine !== undefined) recipe.cuisine = String(cuisine).trim();
    if (diet_type !== undefined) recipe.diet_type = String(diet_type).trim();
    if (general_pricing !== undefined) recipe.general_pricing = String(general_pricing).trim();
    if (image_link !== undefined) recipe.image_link = String(image_link).trim();
    if (calories !== undefined) recipe.calories = Number(calories) || 350;

    if (ingredient_list !== undefined) {
      recipe.ingredient_list = Array.isArray(ingredient_list)
        ? ingredient_list.map((s) => String(s).trim()).filter(Boolean)
        : String(ingredient_list)
            .split(/[\n,]/)
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (recipe_procedure !== undefined) {
      recipe.recipe_procedure = Array.isArray(recipe_procedure)
        ? recipe_procedure.map((s) => String(s).trim()).filter(Boolean)
        : typeof recipe_procedure === 'string'
          ? recipe_procedure.split('\n').map((s) => s.trim()).filter(Boolean)
          : recipe_procedure;
    }

    await recipe.save();
    res.json({ message: 'Recipe updated successfully', recipe });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update recipe', error: err.message });
  }
});

router.get('/api/admin/reports', async (req, res) => {
  try {
    const recipes = await Recipe.find({ 'reports.0': { $exists: true } });
    const reports = [];
    recipes.forEach((r) => {
      (r.reports || []).forEach((rep) => {
        reports.push({
          _id: rep._id,
          recipeId: r._id,
          recipeName: r.recipe_name,
          reporter: rep.reporter_name || 'Guest',
          reason: rep.reason,
          date: rep.date,
        });
      });
    });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load reports', error: err.message });
  }
});

router.delete('/api/admin/report/:recipeId/:reportId', async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    recipe.reports = (recipe.reports || []).filter((r) => String(r._id) !== String(req.params.reportId));
    await recipe.save();
    res.json({ message: 'Report resolved and dismissed.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to dismiss report', error: err.message });
  }
});

router.delete('/api/admin/recipe/:id', async (req, res) => {
  try {
    const recipe = await findRecipeByParam(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    await Recipe.findByIdAndDelete(recipe._id);
    res.json({ message: 'Recipe deleted successfully', id: recipe._id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete recipe', error: err.message });
  }
});

router.get('/api/admin/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ entryDate: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load contact messages', error: err.message });
  }
});

router.delete('/api/admin/contact/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact inquiry deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete contact', error: err.message });
  }
});

router.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users', error: err.message });
  }
});

router.put('/api/admin/user/:id/role', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isAdmin = Boolean(req.body.isAdmin);
    await user.save();
    res.json({ id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update role', error: err.message });
  }
});

// ==========================================
// FAQ & MEALS
// ==========================================
router.post('/add-new-faq', add_new_faq);
router.get('/faqs', get_all_faq);
router.delete('/delete-faq/:id', delete_faq);
router.put('/update-faq/:id', update_faq);

router.post('/add-new-meal', add_new_meal);
router.get('/meals', get_all_meals);
router.delete('/delete-meal/:id', delete_meal);
router.put('/update-meal/:id', update_meal);

// ==========================================
// CONTENT, STORES & CONTACT
// ==========================================
router.get('/glossary', async (req, res) => {
  try {
    const terms = await CookingGlossary.find().sort({ term: 1 });
    res.json(terms);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch glossary', error: err.message });
  }
});

router.get('/health', async (req, res) => {
  try {
    const recs = await Recommendations.find().sort({ disease: 1 });
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch health recommendations', error: err.message });
  }
});

router.get('/stores', async (req, res) => {
  try {
    const lat = Number(req.query.latitude);
    const lon = Number(req.query.longitude);
    const radiusKm = Number(req.query.radius) || 25;

    const stores = await GroceryStore.find().lean();
    const enriched = stores
      .map((s) => {
        const coords = s.location?.coordinates || [90.4125, 23.8103];
        const storeLon = coords[0];
        const storeLat = coords[1];
        const distanceKm =
          !Number.isNaN(lat) && !Number.isNaN(lon)
            ? Number(haversineKm(lat, lon, storeLat, storeLon).toFixed(2))
            : null;
        return {
          ...s,
          latitude: storeLat,
          longitude: storeLon,
          distanceKm,
        };
      })
      .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));

    const filtered =
      !Number.isNaN(lat) && !Number.isNaN(lon)
        ? enriched.filter((s) => s.distanceKm <= radiusKm)
        : enriched;

    res.json(filtered.length > 0 ? filtered : enriched);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stores', error: err.message });
  }
});

router.get('/about-us', async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res.json({
        title: 'About RannaBhai',
        description:
          'RannaBhai is your all-in-one culinary companion — combining authentic recipes, smart meal planning, nutrition calculators, local store discovery, and interactive food trivia.',
        imageUrl: '',
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch about us', error: err.message });
  }
});

router.post('/contact', async (req, res) => {
  try {
    const { email, website, message } = req.body;
    if (!email?.trim() || !message?.trim()) {
      return res.status(400).json({ message: 'Email and message are required.' });
    }
    const saved = await Contact.create({
      email: email.trim(),
      website: website?.trim() || 'Direct',
      message: message.trim(),
    });
    res.status(201).json({ message: 'Message sent! Thank you for reaching out.', data: saved });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit contact form', error: err.message });
  }
});

module.exports = router;
