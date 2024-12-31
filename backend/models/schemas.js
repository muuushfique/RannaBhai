const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type:String},
    email: {type:String},
    website: {type:String},
    entryDate: {type:Date, default:Date.now}
})

const contactSchema = new Schema({
    email: {type:String,},
    website: {type:String,},
    message: {type:String,},
    entryDate: {type:Date, default:Date.now}
})



const recipieSchema = new mongoose.Schema({
  recipe_name: {
    type: String,
    required: true
  },
  no_of_servings: {
    type: Number,
    required: true
  },
  ingredient_list: {
    type: [String], // Array of strings for ingredients
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
  ]
});




// Define a schema for health recommendations
const HealthRecomSchema = new mongoose.Schema({
  recommendation: { type: String, required: true },
});





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
  const Users = mongoose.model('Users', userSchema, 'users')
const Contact = mongoose.model('Contact', contactSchema, 'contact_form')



const Recipe = mongoose.model('Recipe', recipieSchema, 'recipe');

  const CookingGlossary = mongoose.model('CookingGlossary', glossarySchema, 'cooking_glossary');
  


const HealthRecom = mongoose.model('HealthRecom', HealthRecomSchema, "HealthRecom");


const mySchemas = {'Users':Users, 'Contact':Contact, 'Recommendations': HealthRecom, 'Recipe':Recipe, 'CookingGlossary':CookingGlossary}

module.exports = mySchemas


