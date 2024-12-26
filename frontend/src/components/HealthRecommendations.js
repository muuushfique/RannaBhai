// Import necessary modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the component
const HealthRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]); // State to store health recommendations
  const [error, setError] = useState(''); // State to store error messages (if any)

  // Function to fetch recommendations from the backend
  const axiosFetchData = async () => {
    try {
      // Send a GET request to your backend API to fetch the recommendations
      const response = await axios.get(('http://localhost:1240/health')); // Update this URL to your backend endpoint
      setRecommendations(response.data); // Set the recommendations in state
      setError(''); // Clear error (if any)
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations. Please try again.'); // Set an error message
    }
  };

  // Use useEffect to fetch recommendations on component load and every refresh
  useEffect(() => {
    axiosFetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Render the component
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Health Recommendations</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {recommendations.map((rec, index) => (
          <li
            key={index}
            style={{
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9',
            }}
          >
            {rec.recommendation}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Export the component
export default HealthRecommendations;
