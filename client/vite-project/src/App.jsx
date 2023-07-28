import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import HomePage from "./components/HomePage/HomePage";
import Profile from "./components/Profile/Profile";
import News from "./components/News/News";
import Saved from "./components/Saved/Saved";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import EditName from "./components/EditName/EditName";
import EditEmail from "./components/EditEmail/EditEmail";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
          <Route path="/me" element={<Profile />} />
          <Route exact path="/current" element={<News />} />
          <Route exact path="/saved" element={<Saved />} />
          <Route exact path="/edit-name" element={<EditName />} />
          <Route exact path="/edit-email" element={<EditEmail />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
