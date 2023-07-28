import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditEmail.css";

const EditEmail = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const validateEmail = (email) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled in
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`http://localhost:3000/edit-email`, {
        method: "POST",
        body: JSON.stringify({
          newEmail: email,
          password: password,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        // Handle success, e.g., redirect to a new page or show a success message
        navigate("/me");
      } else {
        // Handle error, e.g., display an error message
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
      // Handle error, e.g., display an error message
    }
  };

  return (
    <div id="edit-email">
      <h1>Edit Email Address</h1>
      <div className="edit-email-form">
        <div className="subform">
          <label htmlFor="email"></label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            name="email"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            required
            placeholder="New Email"
          />
        </div>

        <div className="subform">
          <label htmlFor="password"></label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Your Password"
          />
        </div>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="btn btn-link show-button"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        <button
          className="btn btn-primary signup-button"
          type="button"
          id="test"
          onClick={handleSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default EditEmail;
