import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./News.css";
import NewsArticle from "../NewsArticle/NewsArticle";
import NewsTicker from "../NewsTicker/NewsTicker";

const News = () => {
  const [loading, setLoading] = useState(true);
  const [normalItems, setNormalItems] = useState([]);
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    const getNews = async () => {
      try {
        const token = localStorage.getItem("Token");

        const response = await fetch("http://localhost:3000/scrape", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          mode: "cors",
        });

        if (response.ok) {
          const json = await response.json();
          if (json && json.length > 0) {
            const first10Items = json.slice(0, 10); // Get the first 10 items
            const remainingItems = json.slice(10); // Get the remaining items
            setNormalItems(first10Items);
            setTickerItems(remainingItems);
            setLoading(false);
          } else {
            setNormalItems([]);
            setTickerItems([]);
            setLoading(false);
          }
        } else {
          console.error("Error occurred while fetching news data", response);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error occurred while fetching news data", error);
        setLoading(false);
      }
    };

    getNews();
  }, []);

  return (
    <div className="container">
      <nav className="news-navigation d-flex justify-content-center mb-3">
        <ul className="nav">
          <li className="nav-item">
            <Link
              to={"/current"}
              className="active-link"
              activeclass="active-link"
            >
              Current
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to={"/saved"}
              className="active-link"
              activeclass="active-link"
            >
              Saved
            </Link>
          </li>
        </ul>
      </nav>
      <h1 className="text-center" id="heading">
        Latest News
      </h1>
      <div className="news-container">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            <div className="news-ticker">
              <ul>
                {tickerItems.map((article) => (
                  <li key={article.ID}>
                    <NewsTicker
                      title={article.Title}
                      url={article.URL}
                      id={article.ID}
                      stock={article.Stock || ""}
                      description={article.Description || ""}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="news-articles">
              {normalItems.map((article, index) => (
                <NewsArticle
                  key={article.ID}
                  title={article.Title}
                  url={article.URL}
                  id={article.ID}
                  stock={article.Stock || ""}
                  description={article.Description || ""}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default News;
