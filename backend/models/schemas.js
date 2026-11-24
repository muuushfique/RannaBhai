const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const contactSchema = new Schema({
  email: { type: String, required: true, trim: true },
  website: { type: String, default: 'Direct', trim: true },
  message: { type: String, required: true, trim: true },
  entryDate: { type: Date, default: Date.now },
});

const reviewSchema = new Schema({
  reviewer_name: { type: String, default: 'Anonymous Chef' },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const reportSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  reporter_name: { type: String, default: 'Guest' },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const recipeSchema = new Schema(
  {
    id: { type: Number, index: true },
    recipe_name: { type: String, required: true, trim: true },
    no_of_servings: { type: Number, default: 2 },
    ingredient_list: { type: [String], default: [] },
    cuisine: { type: String, default: 'International' },
    diet_type: { type: String, default: 'Regular' },
    general_pricing: { type: String, default: '$$' },
    recipe_procedure: { type: Schema.Types.Mixed, default: [] },
    image_link: { type: String, default: '' },
    calories: { type: Number, default: 350 },
    review_list: { type: [reviewSchema], default: [] },
    like_count: { type: Number, default: 0 },
    dislike_count: { type: Number, default: 0 },
    liked_by: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    disliked_by: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], default: [] },
    reports: { type: [reportSchema], default: [] },
  },
  { timestamps: true }
);

const glossarySchema = new Schema(
  {
    term: { type: String, required: true, unique: true },
    definition: { type: String, required: true },
  },
  { timestamps: true }
);

const healthRecomSchema = new Schema(
  {
    disease: { type: String, required: true, unique: true },
    health_practice: { type: String, required: true },
  },
  { timestamps: true }
);

const groceryStoreSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
});
groceryStoreSchema.index({ location: '2dsphere' });

const aboutSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
});

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true }
);

const mealSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    calories: { type: Number, required: true },
    image: { type: String, default: '' },
    category: { type: String, required: true, enum: ['Breakfast', 'Lunch', 'Dinner'] },
  },
  { timestamps: true }
);

const ingredientSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  ingredient: { type: String, required: true },
  nutrition: { type: Schema.Types.Mixed, default: {} },
  category: { type: String, default: 'Veg' },
});

module.exports = {
  User: mongoose.model('User', userSchema, 'user'),
  Contact: mongoose.model('Contact', contactSchema, 'contact_form'),
  Recipe: mongoose.model('Recipe', recipeSchema, 'recipe'),
  CookingGlossary: mongoose.model('CookingGlossary', glossarySchema, 'cooking_glossary'),
  Recommendations: mongoose.model('Recommendations', healthRecomSchema, 'HealthRecom'),
  GroceryStore: mongoose.model('GroceryStore', groceryStoreSchema, 'stores'),
  About: mongoose.model('About', aboutSchema, 'about_us'),
  FAQ: mongoose.model('FAQ', faqSchema),
  Meal: mongoose.model('Meal', mealSchema),
  Ingredient: mongoose.model('Ingredient', ingredientSchema, 'Ingredients'),
};
