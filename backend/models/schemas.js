const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contactSchema = new Schema({
    email: {type:String,},
    website: {type:String,},
    message: {type:String,},
    entryDate: {type:Date, default:Date.now}
})



const recipieSchema = new mongoose.Schema({
  id: {
    type: Number
  },
  recipe_name: {
    type: String,
    required: true
  },
  no_of_servings: {
    type: Number,
    required: true
  },
  ingredient_list: {
    type: [String], 
    required: true
  },
  cuisine: {
    type: String,
    required: true
  },
  diet_type: {
    type: String,
    
    required: true
  },
  general_pricing: {
    type: Number,
    required: true
  },
  recipe_procedure: {
    from: { type: String, required: true },
    by: { type: String, required: true },
    instructions: { type: String, required: true }
  },
  image_link: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  review_list: [
    {
      reviewer: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 }, 
      comment: { type: String, required: true }
    }
  ],
  like_count: {type: Number, default: 0},
  dislike_count: {type: Number, default: 0},
  reports: [
    {
      message: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ], // New field for storing reports
});

// Define a schema for health recommendations
const HealthRecomSchema = new mongoose.Schema({
  disease: {
    type: String,
    required: true, // Disease name is required
    unique: true,   // Each disease should be unique
  },
  health_practice: {
    type: String,
    required: true, // Health practice is required
  }, 
  recommendation: { type: String, required: true },
},{ timestamps: true });
const glossarySchema = new Schema({
    term: {
      type: String,
      required: true, 
      unique: true, 
    },
    definition: {
      type: String,
      required: true, 
    },
    
  }, { timestamps: true }); 

//for login/signup
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});
  
const User = mongoose.model('User', userSchema, 'user')
const Contact = mongoose.model('Contact', contactSchema, 'contact_form')
const Recipe = mongoose.model('Recipe', recipieSchema, 'recipe');
const CookingGlossary = mongoose.model('CookingGlossary', glossarySchema, 'cooking_glossary');
const HealthRecom = mongoose.model('HealthRecom', HealthRecomSchema, "HealthRecom");
const mySchemas = {'User':User, 'Contact':Contact, 'Recommendations': HealthRecom, 'Recipe':Recipe, 'CookingGlossary':CookingGlossary}

module.exports = mySchemas


