import React, { useState, useEffect } from "react";
import "./SearchSettings.css";
import axios from "axios";
import Space from "../../images/space.jpg";

const SearchSettings = ({ setCards, page, setPage, setCurrentIndex }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

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

  const [titleType, setTitleType] = useState("movie");
  const handleTitleTypeSelect = (e) => {
    setTitleType(e.target.value);
    console.log(e.target.value);
  };

  const [searchType, setSearchType] = useState("top_boxoffice_200");
  const handleSearchTypeSelect = (e) => {
    setSearchType(e.target.value);
    console.log(e.target.value);
  };
  const [genreType, setGenreType] = useState();
  const handleGenreSelect = (e) => {
    setGenreType(e.target.value);
    console.log(e.target.value);
  };
  const [year, setYear] = useState();
  const handleYearSelect = (e) => {
    setYear(e.target.value);
    console.log(e.target.value);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setTitleType(null);
    setSearchTypes(null);
    setGenreType(null);
    setYear(null);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    const searchOptions = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles",
      params: {
        genre: genreType,
        year: year,
        page: page,
        list: searchType,
        titleType: titleType,
      },
      headers: {
        "X-RapidAPI-Key": "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };
    try {
      const response = await axios.request(searchOptions);
      console.log(response);
      if (!response.data.entries > 0) {
        setError("Sorry, there are no results for this search");
        setIsLoading(false);
        throw Error("Sorry, there are no results for this search");
      }
      if (response.data.results) {
        const newCards = [];
        response.data.results.map((result) => {
          console.log(result);
          return newCards.push({
            id: result?.id,
            name: result?.titleText?.text,
            url: result?.primaryImage?.url ?? Space,
            releaseDate: result?.releaseDate
          });
        });
        setCards(newCards);
        setCurrentIndex(newCards.length - 1);
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.error);
        setIsLoading(false);
      }
    }
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
            checked={titleType === "movie"}
            onChange={handleTitleTypeSelect}
          />
          <label htmlFor="movie">Movies</label>
          <input
            id="tvSeries"
            type="radio"
            value="tvSeries"
            checked={titleType === "tvSeries"}
            onChange={handleTitleTypeSelect}
          />
          <label htmlFor="tvSeries">Tv Shows</label>
          <input
            id="videoGame"
            type="radio"
            value="videoGame"
            checked={titleType === "videoGame"}
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
          {searchTypes &&
            searchTypes?.map((showType, i) => {
              return (
                <div key={i}>
                  <input
                    id={showType}
                    type="radio"
                    value={showType}
                    checked={searchType === showType}
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
                    checked={genreType === genre}
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
            min="1900"
            max="2023"
            step="1"
            
            onChange={handleYearSelect}
          />
        </div>
        <button onClick={handleReset}>Reset</button>
      </div>

      <button
        disabled={isLoading}
        onClick={handleSearch}
        className="glow-button"
      >
        {isLoading ? (
          <span className="material-symbols-outlined">pending</span>
        ) : (
          "Search"
        )}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SearchSettings;
