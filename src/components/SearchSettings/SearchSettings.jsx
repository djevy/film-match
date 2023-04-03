import React, { useState } from "react";
import "./SearchSettings.css";

const SearchSettings = (props) => {
  const [showTitleTypes, setShowTitleTypes] = useState();
  const toggleShowTitleTypes = () => {
    setShowTitleTypes(!showTitleTypes);
  };

  const [showSearchTypes, setShowSearchTypes] = useState();
  const toggleShowSearchTypes = () => {
    setShowSearchTypes(!showSearchTypes);
  };
  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Biography",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "Film-Noir",
    "Game-Show",
    "History",
    "Horror",
    "Music",
    "Musical",
    "Mystery",
    "News",
    "Reality-TV",
    "Romance",
    "Sci-Fi",
    "Short",
    "Sport",
    "Talk-Show",
    "Thriller",
    "War",
    "Western",
  ];
  // const [genres, setGenres] = useState();
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
    if (e.target.value === "movie") {
      props.setSearchTypes([
        "most_pop_movies",
        "top_boxoffice_200",
        "top_boxoffice_last_weekend_10",
        "top_rated_250",
        "top_rated_english_250",
        "top_rated_lowest_100",
        "titles",
      ]);
    } else if (e.target.value === "tvSeries") {
      props.setSearchTypes(["most_pop_series", "top_rated_series_250", "titles"]);
    } else if(e.target.value === "videoGame") {
      props.setSearchTypes([]);
    }
    props.setSearchType("any");
    props.setPage(1);
    console.log(e.target.value);
  };

  const handleSearchTypeSelect = (e) => {
    props.setSearchType(e.target.value);
    props.setPage(1);
    console.log(e.target.value);
  };

  const handleGenreSelect = (e) => {
    props.setGenreType(e.target.value);
    props.setPage(1);
    console.log(e.target.value);
  };

  const handleYearSelect = (e) => {
    props.setYear(e.target.value);
    props.setPage(1);
    // console.log(e.target.value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    props.setTitleType(null);
    props.setSearchType(null);
    props.setGenreType(null);
    props.setYear(null);
    props.setPage(1);
  };

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
              id="anyList"
              type="radio"
              value="any"
              checked={props.searchType === "any"}
              onChange={handleSearchTypeSelect}
            />
            <label htmlFor="anyList">Any</label>
          </div>
          {props.searchTypes &&
            props.searchTypes?.map((showType, i) => {
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
          <div>
            <input
              id="anyGenre"
              type="radio"
              value="any"
              checked={props.genreType === "any"}
              onChange={handleGenreSelect}
            />
            <label htmlFor="anyGenre">Any</label>
          </div>
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
          <div className="slider-container">
            <p>Released: {props.year}</p>
            <input
              type="range"
              min="1960"
              max="2023"
              step="1"
              onChange={handleYearSelect}
              className="slider"
            />
          </div>
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
      {props.searchError && <p className="error">{props.searchError}</p>}
    </div>
  );
};

export default SearchSettings;
