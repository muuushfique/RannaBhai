import React from 'react';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>LOGO</h2>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home Page</Link>
        </li>
        <li className="nav-item">
          <Link to="/govt-issues" className="nav-link">Trending Recipes</Link>
        </li>
        <li className="nav-item">
          <Link to="/tweets" className="nav-link">Tweets</Link>
        </li>
        <li className="nav-item">
          <Link to="/near-me" className="nav-link">Near Me</Link>
        </li>
        <li className="nav-item">
          <Link to="/Search" className="nav-link">Search</Link>
        </li>
        <li className="nav-item">
          <Link to="/Review" className="nav-link">Review</Link>
        </li>
        <li className="nav-item">
          <Link to="/HealthRecommendations" className="nav-link">HealthRecommendations</Link>
        </li>
        <li className="nav-item">
          <Link to="/reports" className="nav-link">Reports</Link>
        </li>
        <li className="nav-item">
          <Link to="/community-service" className="nav-link">Community Service</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact-us" className="nav-link">Contact Us</Link>
        </li>
      </ul>
      <div className="bottom-options">
        <button className="btn btn-dark w-100">Dark Mode</button>
        <button className="btn btn-secondary w-100">Profile</button>
        <button className="btn btn-danger w-100">Log Out</button>
      </div>
    </div>
  );
}

export default Nav;
