import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NewsArticle from "../NewsArticle/NewsArticle";
import "./Saved.css";

const Saved = () => {
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchSavedArticles = async () => {
      try {
        const token = localStorage.getItem("Token");
        // const userId = localStorage.getItem("User ID");
        const response = await fetch("http://localhost:3000/saved", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setArticles(data);
          } else {
            setArticles([]);
          }
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error("Error occurred while fetching user data", error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedArticles();
  }, []);

  return (
    <div className="container">
      <nav className="news-navigation d-flex justify-content-center mb-3">
        <ul className="nav">
          <li className="nav-item">
            <Link
              to={"/current"}
              className="active-link"
              activeClassName="active-link"
            >
              Current
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/saved"}
              className="active-link"
              activeClassName="active-link"
            >
              Saved
            </Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-center">Your Saved Articles</h1>

      <div className="news-container">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <p className="text-center" id="no-text">
            No saved articles
          </p>
        ) : (
          articles.map((article, index) => (
            <NewsArticle
              key={index}
              title={article.Title}
              url={article.URL}
              id={article.ID}
              stock={article.Stock || ""}
              description={article.Description || ""}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Saved;
