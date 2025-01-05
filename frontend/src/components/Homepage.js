import React from 'react';
import { Link } from 'react-router-dom';
import './../Customcss/Home.css';
import logo from './RannaBhaiw.png';


function HomePage() {
  return (
    <div className="hm-home-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark hm-navbar">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="RannaBhai Logo" className="hm-logo" />
            RannaBhai
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/about-us" className="hm-nav-link">
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact-us" className="hm-nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hm-hero-section">
        <h1>Welcome to RannaBhai!</h1>
        <p>
          Discover, create, and share amazing recipes while managing your health and meal planning needs.
        </p>
        <Link to="/recipe-of-the-day" className="hm-btn hm-btn-primary hm-btn-lg">
          Explore Recipe of the Day
        </Link>
      </header>

      {/* Features Section */}
      <section className="hm-features-section container-fluid text-center">
        <h2>Explore Your Desire</h2>
        <div className="row justify-content-center">
          <div className="col-md-3 text-center">
            <img
              src="https://images.pexels.com/photos/4050078/pexels-photo-4050078.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt="Trending Recipes"
              className="hm-feature-image"
            />
            <h4>Trending Recipes</h4>
            <p>Check out the hottest and most loved recipes curated for you.</p>
            <Link to="/trending-recipe" className="hm-btn hm-btn-outline-primary">
              View Trending Recipes
            </Link>
          </div>
          <div className="col-md-3 text-center">
            <img
              src="https://images.pexels.com/photos/8844888/pexels-photo-8844888.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Meal Planning"
              className="hm-feature-image"
            />
            <h4>Meal Planning</h4>
            <p>Plan your meals with ease and keep track of your nutrition goals.</p>
            <Link to="/meal-planning" className="hm-btn hm-btn-outline-success">
              Start Meal Planning
            </Link>
          </div>
          <div className="col-md-3 text-center">
            <img
              src="https://images.pexels.com/photos/8175339/pexels-photo-8175339.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Health Recommendations"
              className="hm-feature-image"
            />
            <h4>Health Recommendations</h4>
            <p>Get personalized health and nutrition recommendations.</p>
            <Link to="/health-recommendations" className="hm-btn hm-btn-outline-danger">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="hm-testimonials-section bg-light">
        <div className="container">
          <h2>What Our Users Say</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <img
                src="https://images.pexels.com/photos/2748239/pexels-photo-2748239.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User 1"
                className="hm-user-image rounded-circle"
              />
              <p>"RannaBhai has completely changed the way I cook and eat!"</p>
              <h5>- Sarah M.</h5>
            </div>
            <div className="col-md-4 text-center">
              <img
                src="https://images.pexels.com/photos/1988686/pexels-photo-1988686.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User 2"
                className="hm-user-image rounded-circle"
              />
              <p>"The meal planning feature is a game-changer!"</p>
              <h5>- John D.</h5>
            </div>
            <div className="col-md-4 text-center">
              <img
                src="https://images.pexels.com/photos/3750717/pexels-photo-3750717.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="User 3"
                className="hm-user-image rounded-circle"
              />
              <p>"Health recommendations are spot-on and super helpful."</p>
              <h5>- Emily R.</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hm-footer">
        <div className="container-fluid text-center">
          <p>
            &copy; {new Date().getFullYear()} RannaBhai. All rights reserved. Built for food lovers and health enthusiasts.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
