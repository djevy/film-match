import React, { useState, useEffect } from "react";
import "./SearchSettings.css";
import axios from "axios";

const SearchSettings = (props) => {

  const [showTitleTypes, setShowTitleTypes] = useState();
  const toggleShowTitleTypes = () => {
    setShowTitleTypes(!showTitleTypes);
  };

  const [searchTypes, setSearchTypes] = useState();
  const [showSearchTypes, setShowSearchTypes] = useState();
  const toggleShowSearchTypes = () => {
    setShowSearchTypes(!showSearchTypes);
  };
  const [genres, setGenres] = useState();
  const [showGenres, setShowGenres] = useState();
  const toggleShowGenres = () => {
    setShowGenres(!showGenres);
  };
  const [showYears, setShowYears] = useState();
  const toggleShowYears = () => {
    setShowYears(!showYears);
  };

  const handleTitleTypeSelect = (e) => {
    props.setTitleType(e.target.value);
    props.setPage(1)
    console.log(e.target.value);
  };

  const handleSearchTypeSelect = (e) => {
    props.setSearchType(e.target.value);
    props.setPage(1)
    console.log(e.target.value);
  };

  const handleGenreSelect = (e) => {
    props.setGenreType(e.target.value);
    props.setPage(1)
    console.log(e.target.value);
  };

  const handleYearSelect = (e) => {
    props.setYear(e.target.value);
    props.setPage(1)
    console.log(e.target.value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    props.setTitleType(null);
    props.setSearchTypes(null);
    props.setGenreType(null);
    props.setYear(null);
    props.setPage(1)
  };



  useEffect(() => {
    const genreOptions = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles/utils/genres",
      headers: {
        "X-RapidAPI-Key": "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };
    axios
      .request(genreOptions)
      .then(function (response) {
        if (response.data) {
          setGenres(response.data.results.filter((x) => x));
        }
      })
      .catch(function (error) {
        console.error(error);
      });

    const listOptions = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles/utils/lists",
      headers: {
        "X-RapidAPI-Key": "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };

    axios
      .request(listOptions)
      .then(function (response) {
        if (response.data) {
          setSearchTypes(response.data.results.filter((x) => x));
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);

  return (
    <div className="settings-modal">
      <h3>Settings</h3>
      <div className="settings-options">
        <h4 onClick={toggleShowTitleTypes}>
          Media Type{" "}
          <span className="material-symbols-outlined">
            {showTitleTypes ? "expand_less" : "expand_more"}
          </span>
        </h4>
        <div
          className={`genre-options ${
            showTitleTypes ? "show-genre-options" : ""
          }`}
        >
          <input
            id="movie"
            type="radio"
            value="movie"
            checked={props.titleType === "movie"}
            onChange={handleTitleTypeSelect}
          />
          <label htmlFor="movie">Movies</label>
          <input
            id="tvSeries"
            type="radio"
            value="tvSeries"
            checked={props.titleType === "tvSeries"}
            onChange={handleTitleTypeSelect}
          />
          <label htmlFor="tvSeries">Tv Shows</label>
          <input
            id="videoGame"
            type="radio"
            value="videoGame"
            checked={props.titleType === "videoGame"}
            onChange={handleTitleTypeSelect}
          />
          <label htmlFor="videoGame">Video Games</label>
        </div>

        <h4 onClick={toggleShowSearchTypes}>
          Popular Lists{" "}
          <span className="material-symbols-outlined">
            {showSearchTypes ? "expand_less" : "expand_more"}
          </span>
        </h4>
        <div
          className={`genre-options ${
            showSearchTypes ? "show-genre-options" : ""
          }`}
        >
          <div>
            <input
              id="any"
              type="radio"
              value="any"
              checked={props.searchType === "any"}
              onChange={handleSearchTypeSelect}
            />
            <label htmlFor="any">Any</label>
          </div>
          {searchTypes &&
            searchTypes?.map((showType, i) => {
              return (
                <div key={i}>
                  <input
                    id={showType}
                    type="radio"
                    value={showType}
                    checked={props.searchType === showType}
                    onChange={handleSearchTypeSelect}
                  />
                  <label htmlFor={showType}>
                    {showType.replace(/_/g, " ")}
                  </label>
                </div>
              );
            })}
        </div>

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
                  <input
                    id={genre}
                    type="radio"
                    value={genre}
                    checked={props.genreType === genre}
                    onChange={handleGenreSelect}
                  />
                  <label htmlFor={genre}>{genre}</label>
                </div>
              );
            })}
        </div>
        <h4 onClick={toggleShowYears}>
          Year{" "}
          <span className="material-symbols-outlined">
            {showYears ? "expand_less" : "expand_more"}
          </span>
        </h4>
        <div
          className={`genre-options ${showYears ? "show-genre-options" : ""}`}
        >
          <input
            type="number"
            min="1960"
            max="2023"
            step="1"
            onChange={handleYearSelect}
          />
        </div>
        <button className="button" onClick={handleReset}>
          Reset
        </button>
      </div>

      <button
        disabled={props.isLoading}
        onClick={props.handleSearch}
        className="glow-button"
      >
        {props.isLoading ? (
          <span className="material-symbols-outlined">pending</span>
        ) : (
          "Search"
        )}
      </button>
      {props.error && <p className="error">{props.error}</p>}
    </div>
  );
};

export default SearchSettings;
