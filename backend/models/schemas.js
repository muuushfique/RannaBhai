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




// Define a schema for health recommendations
const HealthRecomSchema = new mongoose.Schema({
  recommendation: { type: String, required: true },
});



const Users = mongoose.model('Users', userSchema, 'users')
const Contact = mongoose.model('Contact', contactSchema, 'contact_form')
// const Recipes = mongoose.model('Recipes', recipieSchema, 'recipe')

// Create a model for the "HealthRecom" collection
const HealthRecom = mongoose.model('HealthRecom', HealthRecomSchema, "HealthRecom");

//exporting Schemas
const mySchemas = {'Users':Users, 'Contact':Contact, 'Recommendations': HealthRecom}

module.exports = mySchemas
