import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import ReportRecipe from './components/ReportRecipe';
import TrendingRecipe from './components/TrendingRecipe';
import Contact from './components/Contact';
import Ingredients from './components/Ingredients';
import IngredientDetails from './components/IngredientDetails'; // For individual ingredient details
import Search from './components/Search';
import Nearme from './components/nearme';
import HealthRecommendations from './components/HealthRecommendations';
import RecipeDetails from './components/RecipeDetails';
import Glossary from './components/Glossary';
import RecipeOfTheDay from './components/RecipeOfTheDay';
import BMI from './components/BMI';
import AboutUs from './components/AboutUs';
import AdminPanel from './components/AdminPanel';
import FAQ from './components/FAQ';
import MealPlanner from './components/MealPlanning';
import RecipeSubmit from './components/RecipeSubmit';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login/login';
import Signup from './components/Login/signup';
import UserDashboard from './components/Login/dashboard';
import Spoon from './components/Spoonacular/Spoonacular';
import SpoonDetails from './components/Spoonacular/SpoonDetails';
import RandomRecipe from './components/Spoonacular/RandomRecipe';
import SpoonacularLanding from './components/Spoonacular/Landing';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          {/* Home and Recipe Details */}
          <Route path="/" element={<Home />} />
          <Route path="/RecipeDetails/:id" element={<RecipeDetails />} />

          {/* Recipe Management */}
          <Route path="/report" element={<ReportRecipe />} />
          <Route path="/trending-recipe" element={<TrendingRecipe />} />
          <Route path="/recipe-submit" element={<RecipeSubmit />} />

          {/* Contact and About */}
          <Route path="/contact-us" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />

          {/* Ingredients */}
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/ingredient/:id" element={<IngredientDetails />} />

          {/* Search */}
          <Route path="/search" element={<Search />} />
          <Route path="/near-me" element={<Nearme />} />

          {/* Miscellaneous */}
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/health-recommendations" element={<HealthRecommendations />} />
          <Route path="/recipe-of-the-day" element={<RecipeOfTheDay />} />
          <Route path="/bmi" element={<BMI />} />

          {/* FAQ and Meal Planning */}
          <Route path="/faq" element={<FAQ />} />
          <Route path="/meal-planning" element={<MealPlanner />} />

          {/* Login and Dashboard */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Admin Panel */}
          <Route path="/admin-panel" element={<AdminPanel />} />

          {/* Spoonacular */}
          <Route path="/spoonacular-landing" element={<SpoonacularLanding />} />
          <Route path="/spoonacular" element={<Spoon />} />
          <Route path="/spoon-details/:id" element={<SpoonDetails />} />
          <Route path="/random-recipe" element={<RandomRecipe />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
