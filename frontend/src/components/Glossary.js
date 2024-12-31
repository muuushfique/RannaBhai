import React, { useEffect, useState } from "react";
import axios from "axios";

const Glossary = () => {
  const [glossaryTerms, setGlossaryTerms] = useState([]); // State to store glossary terms
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

  // Conditional rendering
  if (loading) {
    return <p>Loading glossary terms...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Cooking Glossary</h1>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {glossaryTerms.map((term, index) => (
          <li
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
              marginBottom: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3>{term.term}</h3>
            <p>{term.definition}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Glossary;