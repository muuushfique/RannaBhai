const schemas = require('../models/schemas')


// Ammarah
// create new 
const createRecipe = async (req, res) => {
    const {recipe_name, cuisine_type, nutrient_list, calorie_count} = req.body
    // add doc to db
    try{
        const recipe = await schemas.create({recipe_name, cuisine_type, nutrient_list, calorie_count})
        res.status(200).json(recipe)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}