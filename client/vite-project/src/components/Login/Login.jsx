// Updated Login Component
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled in
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (response.ok) {
        const { token, userId } = await response.json();
        localStorage.setItem("Token", token);
        // localStorage.setItem("User ID", userId);
        setIsLoggedIn(true);
        navigate("/me");
      } else {
        const errorData = await response.json();
        console.log(errorData.msg);
        // Handle error case, such as displaying an error message
      }
    } catch (error) {
      console.error("Error occurred during login", error);
      // Handle error case, such as displaying an error message
    }
  };

  return (
    <div id="login" className="flex-col">
      <div className="login-form">
        <div className="subform">
          <label htmlFor="email"> </label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            name="email"
            placeholder="Email"
          />
        </div>
        <div className="subform">
          <label htmlFor="password"></label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
          />
        </div>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="btn btn-link show-button"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        <button className="btn btn-primary login-button" onClick={handleSubmit}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
