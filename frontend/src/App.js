import './App.css';
import React from 'react';
import Nav from './components/Nav';
import Home from './components/Home';
import Tweet from './components/Tweet';
import GovtIssues from './components/GovtIssues';
import Contact from './components/Contact'
import Nearme from './components/nearme'
import Search from './components/Search'
import Review from './components/Review'
import HealthRecommendations from './components/HealthRecommendations';
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
          <Route path="near-me" element={<Nearme />} />
          <Route path="Search" element={<Search />} />
          <Route path="Review" element={<Review />} />
          <Route path="HealthRecommendations" element={<HealthRecommendations />} />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
