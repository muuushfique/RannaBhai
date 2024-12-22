const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type:String},
    email: {type:String},
    website: {type:String},
    entryDate: {type:Date, default:Date.now}
})

const contactSchema = new Schema({
    email: {type:String, require:true},
    website: {type:String, require:true},
    message: {type:String, require:true},
    entryDate: {type:Date, default:Date.now}
})

const Users = mongoose.model('Users', userSchema, 'users')
const Contact = mongoose.model('Contact', contactSchema, 'contact_form')

//exporting Schemas
const mySchemas = {'User':User, 'Contact':Contact}

module.export = mySchemas