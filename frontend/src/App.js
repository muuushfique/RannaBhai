import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Tweet from './components/Tweet';
import TrendingRecipe from './components/TrendingRecipe';
import Contact from './components/Contact'
import Nearme from './components/nearme'
import Search from './components/Search' 
import HealthRecommendations from './components/HealthRecommendations';
import RecipeDetails from './components/RecipeDetails';
import Glossary from './components/Glossary';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/RecipeDetails/:id" element={<RecipeDetails />} />
          <Route path="/tweets" element={<Tweet />} />
          <Route path="/trending-recipe" element={<TrendingRecipe />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="near-me" element={<Nearme />} />
          <Route path="Search" element={<Search />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="HealthRecommendations" element={<HealthRecommendations />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
