import React, { useState, useEffect } from "react";
import axios from "axios";

function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatbotWidget, setChatbotWidget] = useState("");

  useEffect(() => {
    (function (w, d, s, o, f, js, fjs) {
      w["botsonic_widget"] = o;
      w[o] =
        w[o] ||
        function () {
          (w[o].q = w[o].q || []).push(arguments);
        };
      (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
      js.id = o;
      js.src = f;
      js.async = 1;
      fjs.parentNode.insertBefore(js, fjs);
    })(
      window,
      document,
      "script",
      "Botsonic",
      "https://widget.writesonic.com/CDN/botsonic.min.js"
    );

    Botsonic("init", {
      serviceBaseUrl: "https://api.botsonic.ai/v1/botsonic/generate",
      token: "03342397-cb53-45b1-b842-ce9e0f7c6032",
    });

    // Open the chatbot when the component mounts
    Botsonic("open");
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${searchQuery}&apikey=demo`
      );
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data.feed)) {
          const formattedResults = data.feed.map((item) => ({
            title: item.title,
            url: item.url,
            banner_image: item.banner_image,
            overall_sentiment_label: item.overall_sentiment_label,
          }));
          setSearchResults(formattedResults);
        } else {
          console.error("Invalid data format:", data);
        }
      } else {
        console.error("Failed to fetch news");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <div className="bg-black w-2/3 rounded-[3px] h-28 px-3 pt-2">
        <h1 className="text-white text-2xl">Your daily updates are here!</h1>
        <input
          className="w-[72.66%] h-[35.33px] rounded-[40px]  bg-zinc-300 mt-4 pl-4 "
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={handleChange}
        />
        <button
          className="w-[140.25px] h-[35.33px] rounded-[40px]  bg-zinc-300 mt-4  ml-10"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="w-2/3">
        {searchResults.map((newsItem, index) => (
          <div key={index} className="flex mb-4">
            <div className="w-3/4 pr-4">
              <h2 className="text-xl font-semibold mb-2">
                <div className="ml-10">
                  <a
                    href={newsItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline hover:text-blue-700"
                  >
                    {newsItem.title}
                  </a>
                </div>
              </h2>
              <p>{newsItem.overall_sentiment_label}</p>
              <div>
                <button
                  className={`${
                        newsItem.overall_sentiment_label === "Bullish" ? "highlight ml-10" : ""
                    } ml-10`}
                  >
                  Buy
                </button>
                <button
                  className={`${
                        newsItem.overall_sentiment_label === "Bullish" ? "highlight ml-10" : ""
                    } ml-10`}
                >
                  Sell
                </button>
                <button
                  className={`${
                    newsItem.overall_sentiment_label === "Neutral"
                      ? "highlight"
                      : ""
                  }ml-10` }
                >
                  Hold
                </button>
              </div>
            </div>
            <div className="w-1/4">
              <img
                className="h-auto w-full "
                src={newsItem.banner_image}
                alt={newsItem.title}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default News;
