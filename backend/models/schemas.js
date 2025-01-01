const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
   name: { type: String },
   email: { type: String },
   website: { type: String },
   entryDate: { type: Date, default: Date.now },
});

// Contact Schema
const contactSchema = new Schema({
   email: { type: String, required: true },
   website: { type: String, required: true },
   message: { type: String, required: true },
   entryDate: { type: Date, default: Date.now },
});

// Recipe Schema
const recipeSchema = new Schema({
   id: { type: Number, required: true },
   recipe_name: { type: String, required: true },
   no_of_servings: { type: Number, required: true },
   ingredient_list: [{ type: String, required: true }],
   cuisine: { type: String, required: true },
   diet_type: { type: String, required: true },
   general_pricing: { type: Number, required: true },
   recipe_procedure: {
       from: { type: String, required: true },
       by: { type: String, required: true },
       instructions: { type: String, required: true },
   },
   image_link: { type: String, required: true },
   calories: { type: Number, required: true },
   review_list: [
       {
           reviewer: { type: String, required: true },
           rating: { type: Number, required: true },
           comment: { type: String, required: true },
       },
   ],
   like_count: { type: Number, default: 0 },
   dislike_count: { type: Number, default: 0 },
});

const ingredientSchema = new Schema({
    id: { type: Number, required: true },
    ingredient: { type: String, required: true },
    nutrition: {
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        carbohydrates: { type: Number, required: true },
        fats: { type: Number, required: true },
        fiber: { type: Number, required: true },
        calcium: { type: Number, required: true },
        minerals: { type: Number, required: true },
    },
    category: { type: String, required: true }, // 'veg' or 'non-veg'
 });
 

// Create models from the schemas
const Users = mongoose.model('Users', userSchema, 'users');
const Contact = mongoose.model('Contact', contactSchema, 'contact_form');
const Recipe = mongoose.model('Recipe', recipeSchema, 'recipe');

const Ingredient = mongoose.model('Ingredient', ingredientSchema, 'Ingredients');

module.exports = { Users, Contact, Recipe, Ingredient };
