import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./NewsTicker.css";

const NewsTicker = ({ title, url, id, description, stock }) => {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Check if the article is saved in local storage
    const savedArticles = JSON.parse(localStorage.getItem("savedArticles"));
    if (savedArticles && savedArticles.includes(id)) {
      setSaved(true);
    }
  }, [id]);

  const handleSave = async () => {
    if (saved) {
      handleUnsave();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("Token");

    try {
      const response = await fetch("http://localhost:3000/saveArticle", {
        method: "POST",
        body: JSON.stringify({
          article_id: id,
          title: title,
          url: url,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (response.ok) {
        console.log("Article saved successfully.");

        // Save the article ID to local storage
        const savedArticles =
          JSON.parse(localStorage.getItem("savedArticles")) || [];
        savedArticles.push(id);
        localStorage.setItem("savedArticles", JSON.stringify(savedArticles));

        setSaved(true);
      } else {
        console.error("Failed to save the article.");
      }
    } catch (error) {
      console.error("Error occurred during saving article", error);
    }
  };

  const handleUnsave = async () => {
    const token = localStorage.getItem("Token");

    try {
      const response = await fetch("http://localhost:3000/unsaveArticle", {
        method: "POST",
        body: JSON.stringify({
          article_id: id,
          title: title,
          url: url,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        mode: "cors",
      });

      if (response.ok) {
        console.log("Article unsaved successfully.");

        // Remove the article ID from local storage
        const savedArticles =
          JSON.parse(localStorage.getItem("savedArticles")) || [];
        const updatedSavedArticles = savedArticles.filter(
          (articleId) => articleId !== id
        );
        localStorage.setItem(
          "savedArticles",
          JSON.stringify(updatedSavedArticles)
        );

        setSaved(false);
      } else {
        console.error("Failed to unsave the article.");
      }
    } catch (error) {
      console.error("Error occurred during unsaving article", error);
    }
  };

  return (
    <div className="news-article" id="ticker-article">
      <h3>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="news-article-title"
        >
          {title}
        </a>
      </h3>
      <button
        type="button"
        onClick={handleSave}
        className="btn save-button"
        id="ticker-button"
      >
        {saved ? "Unsave" : "Save"}
      </button>
    </div>
  );
};

NewsTicker.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  description: PropTypes.string,
  stock: PropTypes.string,
};

export default NewsTicker;
