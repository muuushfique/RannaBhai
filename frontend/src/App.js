import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import ReportRecipe from './components/ReportRecipe';
import TrendingRecipe from './components/TrendingRecipe';
import Contact from './components/Contact'
import Nearme from './components/nearme'
import Search from './components/Search' 
import HealthRecommendations from './components/HealthRecommendations';
import RecipeDetails from './components/RecipeDetails';
import Glossary from './components/Glossary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login/login';
import Signup from './components/Login/signup';
import UserDashboard from './components/Login/dashboard';
import AdminPanel from './components/Login/AdminPanel';
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
          <Route path="/" element={<Home />} />
          <Route path="/RecipeDetails/:id" element={<RecipeDetails />} />
          <Route path="/report" element={<ReportRecipe />} />
          <Route path="/trending-recipe" element={<TrendingRecipe />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="near-me" element={<Nearme />} />
          <Route path="Search" element={<Search />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="HealthRecommendations" element={<HealthRecommendations />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
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
