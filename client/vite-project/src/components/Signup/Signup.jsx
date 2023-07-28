import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (email) => {
    // Email validation regex pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled in
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Validate email
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/signup`, {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (response.ok) {
        const json = await response.json();
        console.log(json);
        // Handle success, e.g., redirect to a new page or show a success message
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
    <div id="signup" className="flex-col">
      <div className="signup-form">
        <div className="subform">
          <label htmlFor="firstName"></label>
          <input
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            type="text"
            name="firstName"
            placeholder="First Name"
            className="input-field"
          />
        </div>

        <div className="subform">
          <label htmlFor="lastName"></label>
          <input
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            type="text"
            name="lastName"
            placeholder="Last Name"
            className="input-field"
          />
        </div>

        <div className="subform">
          <label htmlFor="email"></label>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            name="email"
            placeholder="Email"
            pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
            required
            className="input-field"
          />
        </div>

        <div className="subform">
          <label htmlFor="password"></label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Set Password"
            className="input-field"
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
          type="submit"
          id="test"
          onClick={handleSubmit}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
