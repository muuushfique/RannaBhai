const schemas = require('../models/schemas')



//Ipsit
const add_new_faq = async (req, res) => {
    const {question, answer} = req.body
    try{
        const faq = await schemas.FAQ.create({question, answer})
        res.status(200).json(faq)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const get_all_faq = async (req, res) => {
    try{
        const faq = await schemas.FAQ.find({})
        res.status(200).json(faq)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const delete_faq = async (req, res) => {
    const {id} = req.params
    console.log(id)
    try{
        const faq = await schemas.FAQ.findByIdAndDelete(id)
        res.status(200).json(faq)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const update_faq = async (req, res) => {
    const {id} = req.params
    const {question, answer} = req.body
    try{
        const faq = await schemas.FAQ.findByIdAndUpdate(id, {question, answer})
        res.status(200).json(faq)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const add_new_meal = async (req, res) => {
    const {name, description, calories, image, category} = req.body
    try{
        const meal = await schemas.Meal.create({name, description, calories, image, category})
        res.status(200).json(meal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const get_all_meals = async (req, res) => {
    try{
        const meal = await schemas.Meal.find({})
        res.status(200).json(meal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const delete_meal = async (req, res) => {
    const {id} = req.params
    console.log(id)
    try{
        const meal = await schemas.Meal.findByIdAndDelete(id)
        res.status(200).json(meal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const update_meal = async (req, res) => {
    const {id} = req.params
    const {name, description, calories, image, category} = req.body
    try{
        const meal = await schemas.Meal.findByIdAndUpdate(id, {name, description, calories, image, category})
        res.status(200).json(meal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
const controller = {'add_new_faq':add_new_faq, 'get_all_faq':get_all_faq, 'delete_faq':delete_faq, 'update_faq':update_faq, 'add_new_meal':add_new_meal, 'get_all_meals':get_all_meals, 'delete_meal':delete_meal, 'update_meal':update_meal}



module.exports = controller