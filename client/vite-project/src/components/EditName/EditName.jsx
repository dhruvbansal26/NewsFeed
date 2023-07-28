import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditName.css";

const EditName = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled in
    if (!firstName || !lastName || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("Token");
      const response = await fetch(`http://localhost:3000/edit-name`, {
        method: "POST",
        body: JSON.stringify({
          newFirstName: firstName,
          newLastName: lastName,
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
    <div id="edit-name">
      <h1>Edit Name</h1>
      <div className="edit-name-form">
        <div className="subform">
          <label htmlFor="firstName"></label>
          <input
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            type="text"
            name="firstName"
            placeholder="Set First Name"
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
            placeholder="Set Last Name"
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

export default EditName;
