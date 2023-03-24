import React, { useState, useEffect } from "react";
import "./SearchSettings.css";
import axios from "axios";

const SearchSettings = () => {
  const [genres, setGenres] = useState();
  const [showGenres, setShowGenres] = useState();
  const toggleShowGenres = () => {
    setShowGenres(!showGenres);
  };
  const [showYears, setShowYears] = useState();
  const toggleShowYears = () => {
    setShowYears(!showYears);
  };

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles/utils/genres",
      headers: {
        "X-RapidAPI-Key": "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        if (response.data) {
          setGenres(response.data.results.filter((x) => x));
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <div className="settings-modal">
      <h3>Settings</h3>
      <h4 onClick={toggleShowGenres}>
        Genre{" "}
        <span className="material-symbols-outlined">
          {showGenres ? "expand_less" : "expand_more"}
        </span>
      </h4>
      <div
        className={`genre-options ${showGenres ? "show-genre-options" : ""}`}
      >
        {genres &&
          genres?.map((genre, i) => {
            return (
              <div key={i}>
                <input type="radio" name="fav_language" value={genre} />
                <label htmlFor={genre}>{genre}</label>
              </div>
            );
          })}
      </div>
      <h4 onClick={toggleShowYears}>
        Year         <span className="material-symbols-outlined">
          {showYears ? "expand_less" : "expand_more"}
        </span>
      </h4>
      <div
        className={`genre-options ${showYears ? "show-genre-options" : ""}`}
      >
        <input type="number" min="1900" max="2099" step="1" defaultValue="2023" />
      </div>

      <button className="glow-button">Search</button>
    </div>
  );
};

export default SearchSettings;
