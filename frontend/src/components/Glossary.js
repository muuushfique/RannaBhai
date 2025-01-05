import React, { useEffect, useState } from "react";
import axios from "axios";

const Glossary = () => {
  const [glossaryTerms, setGlossaryTerms] = useState([]); // State to store glossary terms
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch glossary terms from the backend
  useEffect(() => {
    const fetchGlossaryTerms = async () => {
      try {
        console.log("Fetching glossary terms...");
        const response = await axios.get("http://localhost:1240/glossary"); // Replace with your backend endpoint
        console.log("Response:", response.data);
        setGlossaryTerms(response.data); // Set the glossary terms
        setLoading(false); // Set loading to false after data is fetched
      } catch (err) {
        console.error("Error fetching glossary terms:", err);
        setError("Failed to fetch glossary terms. Please try again later.");
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    fetchGlossaryTerms();
  }, []);
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter glossary terms based on the search term
  const filteredTerms = glossaryTerms.filter((term) =>
    term.term.toLowerCase().includes(searchTerm.toLowerCase())
  );
    // Conditional rendering
    if (loading) {
      return (
        <div className="faq-container">
          <h1 className="faq-title">Cooking Glossary</h1>
          <div className="faq-list">
            <p className="loading">Loading glossary terms...</p>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="faq-container">
          <h1 className="faq-title">Cooking Glossary</h1>
          <div className="faq-list">
            <p className="error">{error}</p>
          </div>
        </div>
      );
    }
  
    return (
      <div className="faq-container">
        <h1 className="faq-title">Cooking Glossary</h1>
        <input
          type="text"
          placeholder="Search for a term..."
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
          {filteredTerms.length === 0 ? (
            <p className="loading">No glossary terms available at the moment.</p>
          ) : (
            filteredTerms.map((term, index) => (
              <div key={index} className="translucent-box" style={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}>
                <div className="faq-question">{term.term}</div>
                <div className="faq-answer">{term.definition}</div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  
export default Glossary;