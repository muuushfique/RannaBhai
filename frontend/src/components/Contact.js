import { useState, useEffect } from "react";
import axios from "axios";
import "./../Customcss/Contact.css"; // Import the CSS

function Contact() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [selectData, setSelectData] = useState([]);
  const [selectValue, setSelectValue] = useState("");

  // Fetch dropdown data on component mount
  useEffect(() => {
    let processing = true;
    axiosFetchData(processing);
    return () => {
      processing = false;
    };
  }, []);

  const axiosFetchData = async (processing) => {
    await axios
      .get("http://localhost:1240/users")
      .then((res) => {
        if (processing) {
          setSelectData(res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const axiosPostData = async () => {
    const postData = {
      email: email,
      website: selectValue,
      message: message,
    };
    try {
      const response = await axios.post("http://localhost:1240/contact", postData);
      setError(<p className="success">{response.data}</p>);
    } catch (err) {
      console.error("Axios Error:", err);
      setError(<p className="error">Network Error: {err.message}</p>);
    }
  };

  const SelectDropdown = () => (
    <select
      value={selectValue}
      onChange={(e) => setSelectValue(e.target.value)}
      className="form-select"
    >
      <option value="" key="none">
        -- Select One --
      </option>
      {selectData.map((item) => (
        <option value={item.website} key={item.website}>
          {item.website}
        </option>
      ))}
    </select>
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) {
      setError(<p className="required">Message is empty. Please type a message.</p>);
    } else {
      setError("");
      axiosPostData();
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <form className="contact-form">
          <label>Email</label>
          <input
            type="text"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
          />

          <label>How Did You Hear About Us?</label>
          <SelectDropdown />

          <label>Message</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-textarea"
          ></textarea>

          {error}

          <button type="submit" onClick={handleSubmit} className="form-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
