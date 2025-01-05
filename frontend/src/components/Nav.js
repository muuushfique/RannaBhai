import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../Customcss/Nav.css'; // Import the CSS file

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasHovered, setHasHovered] = useState(false);

  // Toggle Dropdown on Button Click
  const toggleDropdown = () => {
    setDropdownOpen(true);
    setHasHovered(false); // Reset hover tracking when dropdown opens
  };

  // Handle First Hover on Submenu
  const handleSubmenuHover = () => {
    setHasHovered(true);
  };

  // Close Dropdown When Hovering Away
  const handleMouseLeave = () => {
    if (hasHovered) {
      setDropdownOpen(false);
    }
  };

  return (
    <div className="nav-bottom-bar">
      <Link to="/" className="nav-link">
        <i className="fa fa-home"></i>
        <span className="nav-text">Home</span>
      </Link>
      <Link to="/recipe" className="nav-link">
        <i className="fa fa-book"></i>
        <span className="nav-text">Recipes</span>
      </Link>
      <Link to="/trending-recipe" className="nav-link">
        <i className="fa fa-cutlery"></i>
        <span className="nav-text">Trending</span>
      </Link>
      <Link to="/recipe-of-the-day" className="nav-link">
        <i className="fa fa-star"></i>
        <span className="nav-text">Recipe of the Day</span>
      </Link>
      <Link to="/meal-planning" className="nav-link">
        <i className="fa fa-calendar"></i>
        <span className="nav-text">Meal Plan</span>
      </Link>
      <Link to="/search" className="nav-link">
        <i className="fa fa-search"></i>
        <span className="nav-text">Search</span>
      </Link>
      <Link to="/spoonacular" className="nav-link">
        <i className="fa fa-lemon-o"></i>
        <span className="nav-text">Spoonacular</span>
      </Link>
      <Link to="/login" className="nav-link">
        <i className="fa fa-sign-in"></i>
        <span className="nav-text">Log In</span>
      </Link>

      {/* Dropdown for Other Links */}
      <div
        className="nav-dropdown-container"
        onMouseLeave={handleMouseLeave} // Close when hovering away
      >
        <button onClick={toggleDropdown} className="nav-link dropdown-btn">
          <i className="fa fa-ellipsis-h"></i>
          <span className="nav-text">More</span>
        </button>
        {dropdownOpen && (
          <div
            className="nav-dropdown-above"
            onMouseEnter={handleSubmenuHover} // Mark submenu as hovered
          >
            <Link to="/report" className="nav-dropdown-link">
              <i className="fa fa-flag"></i> Report
            </Link>
            <Link to="/near-me" className="nav-dropdown-link">
              <i className="fa fa-map-marker"></i> Near Me
            </Link>
            <Link to="/recipe-submit" className="nav-dropdown-link">
              <i className="fa fa-upload"></i> Submit Recipe
            </Link>
            <Link to="/bmi" className="nav-dropdown-link">
              <i className="fa fa-heartbeat"></i> BMI
            </Link>
            <Link to="/faq" className="nav-dropdown-link">
              <i className="fa fa-question-circle"></i> FAQs
            </Link>
            <Link to="/about-us" className="nav-dropdown-link">
              <i className="fa fa-info-circle"></i> About Us
            </Link>
            <Link to="/health-recommendations" className="nav-dropdown-link">
              <i className="fa fa-stethoscope"></i> Health
            </Link>
            <Link to="/glossary" className="nav-dropdown-link">
              <i className="fa fa-book"></i> Glossary
            </Link>
            <Link to="/contact-us" className="nav-dropdown-link">
              <i className="fa fa-envelope"></i> Contact Us
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;
