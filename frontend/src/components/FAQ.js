import React, { useState, useEffect } from 'react';
import '../css/FAQ.css';
import axios from 'axios';


const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get('http://localhost:1240/faqs');
      setFaqs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load FAQs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading FAQs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.length === 0 ? (
          <p className="loading">No FAQs available at the moment.</p>
        ) : (
          faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-question">{faq.question}</div>
              <div className="faq-answer">{faq.answer}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQ;