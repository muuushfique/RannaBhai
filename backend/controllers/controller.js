const { FAQ, Meal } = require('../models/schemas');

// FAQ CRUD
const add_new_faq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question?.trim() || !answer?.trim()) {
      return res.status(400).json({ message: 'Question and answer are required.' });
    }
    const newFaq = await FAQ.create({ question: question.trim(), answer: answer.trim() });
    res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add FAQ', error: error.message });
  }
};

const get_all_faq = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch FAQs', error: error.message });
  }
};

const delete_faq = async (req, res) => {
  try {
    const deleted = await FAQ.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'FAQ not found' });
    res.json({ message: 'FAQ deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete FAQ', error: error.message });
  }
};

const update_faq = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const updated = await FAQ.findByIdAndUpdate(
      req.params.id,
      { question, answer },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'FAQ not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update FAQ', error: error.message });
  }
};

// Meal CRUD
const add_new_meal = async (req, res) => {
  try {
    const { name, description, calories, image, category } = req.body;
    if (!name?.trim() || !description?.trim() || !calories || !category) {
      return res.status(400).json({ message: 'Name, description, calories, and category are required.' });
    }
    const newMeal = await Meal.create({
      name: name.trim(),
      description: description.trim(),
      calories: Number(calories),
      image: image || '',
      category,
    });
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add meal', error: error.message });
  }
};

const get_all_meals = async (req, res) => {
  try {
    const meals = await Meal.find().sort({ category: 1, calories: 1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meals', error: error.message });
  }
};

const delete_meal = async (req, res) => {
  try {
    const deleted = await Meal.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Meal not found' });
    res.json({ message: 'Meal deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete meal', error: error.message });
  }
};

const update_meal = async (req, res) => {
  try {
    const { name, description, calories, image, category } = req.body;
    const updated = await Meal.findByIdAndUpdate(
      req.params.id,
      { name, description, calories: Number(calories), image, category },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Meal not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update meal', error: error.message });
  }
};

module.exports = {
  add_new_faq,
  get_all_faq,
  delete_faq,
  update_faq,
  add_new_meal,
  get_all_meals,
  delete_meal,
  update_meal,
};
