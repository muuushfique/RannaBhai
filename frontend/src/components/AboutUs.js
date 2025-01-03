import React from 'react';

import axios from "axios";
import { useEffect, useState } from "react";

const AboutUs = () => {
  const [aboutContent, setAboutContent] = useState(null);

  useEffect(() => {
    const fetchAboutUsContent = async () => {
      try {
        const response = await axios.get("http://localhost:1240/about-us");
        setAboutContent(response.data);
      } catch (error) {
        console.error("Error fetching About Us content:", error);
      }
    };
    fetchAboutUsContent();
  }, []);

  if (!aboutContent) return <p>Loading...</p>;

  return (
    <div
      style={{
        backgroundImage: `url(${aboutContent.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        padding: "50px 20px",
        textAlign: "center",
        minHeight: "400px",
      }}
    >
      <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>
        {aboutContent.title}
      </h1>
      <p style={{ fontSize: "18px", lineHeight: "1.6", marginTop: "20px" }}>
        {aboutContent.description}
      </p>
    </div>
  );
};

export default AboutUs;
