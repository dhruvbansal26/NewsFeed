import React, { useState, useEffect } from "react";
import "./HomePage.css";

const HomePage = () => {
  const init = async () => {
    try {
      const response = await fetch(`http://localhost:3000/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
      });
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleRedirect = () => {
    window.open("https://github.com/dhruvbansal26/NewsFeed", "_blank");
  };

  return (
    <div className="home-div">
      <h1 className="welcome-text text-center">Welcome to FNT</h1>
      <p className="info-text lead text-center">
        Financial News Tracker is an exciting personal project designed to
        provide you with the most up-to-date information about financial markets
        and cryptocurrencies, sourced from top news websites. This is an
        open-source project hosted on GitHub. By visiting the GitHub repository,
        you can explore the project's codebase, contribute to its development,
        or even use it as a starting point for your project.
      </p>
      <button
        type="button"
        className="btn btn-primary"
        id="git-button"
        onClick={handleRedirect}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-github"
          viewBox="0 0 16 16"
        >
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
        <span id="git-text">GitHub Repository</span>
      </button>
    </div>
  );
};

export default HomePage;
