import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("Token");

      const response = await fetch(`http://localhost:3000/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsLoggedIn(false);
        localStorage.removeItem("Token");
      } else {
        // Handle error response
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.log("Internal Server Error: ", error);
    }
  };

  useEffect(() => {
    const checkUserAuthentication = () => {
      // Implement your authentication logic here
      // Example: Check if the user's token exists in local storage
      const token = localStorage.getItem("Token");
      return !!token; // Return true if token exists, false otherwise
    };

    const isAuthenticated = checkUserAuthentication();
    setIsLoggedIn(isAuthenticated);
  }, []);

  return (
    <nav className="navbar navbar-expand">
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to={"/"} className="active-link">
            Home
          </Link>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="nav-item">
              <Link to={"/login"} className="active-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/signup"} className="active-link">
                Signup
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to={"/me"} className="active-link">
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/"} className="active-link" onClick={handleLogout}>
                Logout
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/current"} className="active-link">
                News
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
