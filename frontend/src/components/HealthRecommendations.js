import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]); // State to store health recommendations
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(""); // State to store error messages (if any)

  // Function to fetch recommendations from the backend
  const axiosFetchData = async () => {
    try {
      // Send a GET request to your backend API to fetch the recommendations
      const response = await axios.get("http://localhost:1240/health"); // Update this URL to your backend endpoint
      setRecommendations(response.data); // Set the recommendations in state
      setLoading(false); // Set loading to false after data is fetched
      setError(""); // Clear error (if any)
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError("Failed to load recommendations. Please try again."); // Set an error message
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  // Use useEffect to fetch recommendations on component load and every refresh
  useEffect(() => {
    axiosFetchData();
  }, []); // Empty dependency array ensures this runs only once on component mount

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter recommendations based on the search term (disease name)
  const filteredRecommendations = recommendations.filter((rec) =>
    rec.disease.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort recommendations so that matches appear at the top
  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const aMatch = a.disease.toLowerCase().startsWith(searchTerm.toLowerCase());
    const bMatch = b.disease.toLowerCase().startsWith(searchTerm.toLowerCase());

    if (aMatch && !bMatch) return -1; // a comes first
    if (!aMatch && bMatch) return 1; // b comes first
    return 0; // no change in order
  });

  // Conditional rendering
  if (loading) {
    return (
      <div className="faq-container">
        <h1 className="faq-title">Health Recommendations</h1>
        <div className="faq-list">
          <p className="loading">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="faq-container">
        <h1 className="faq-title">Health Recommendations</h1>
        <div className="faq-list">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="faq-container">
      <h1 className="faq-title">Health Recommendations</h1>
      <input
        type="text"
        placeholder="Search by disease name..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />
      <div className="faq-list">
        {sortedRecommendations.length === 0 ? (
          <p className="loading">No recommendations found for "{searchTerm}".</p>
        ) : (
          sortedRecommendations.map((rec, index) => (
            <div key={index} className="translucent-box" style={{
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            }}>
              <div className="faq-question">
                {rec.disease}
              </div>
              <div className="faq-answer">
                {rec.health_practice}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthRecommendations;