import React, { useState } from "react";
import axios from "axios";

function Signup() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:1240/api/signup", formData);
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => (window.location.href = "/login"), 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Signup failed. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign Up</h2>
        {message && <div className="auth-message">{message}</div>}
        <form onSubmit={handleSignup}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Log in here</a>.
        </p>
      </div>
    </div>
  );
}

export default Signup;
