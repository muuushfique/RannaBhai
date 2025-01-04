import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Tweet from './components/Tweet';
import GovtIssues from './components/GovtIssues';
import Contact from './components/Contact'
import Ingredients from './components/Ingredients';
import IngredientDetails from './components/IngredientDetails'; // For individual ingredient details
import Search from './components/Search' 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tweets" element={<Tweet />} />
          <Route path="/govt-issues" element={<GovtIssues />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/ingredient/:id" element={<IngredientDetails />} />
          <Route path="Search" element={<Search />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;