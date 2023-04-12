import React, { useState } from "react";
import axios from "axios";
import "./Match.css";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";

const Match = (props) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [matchData, setMatchData] = useState();
  const [openMore, setOpenMore] = useState(false);

  const handleMoreInfo = async (e) => {
    e.preventDefault();
    setOpenMore(!openMore);
    if (matchData) return;
    setIsLoading(true);
    setError(null);
    if (props.match.mediaType === "movie") {
      const options = {
        method: "GET",
        url: `https://moviesminidatabase.p.rapidapi.com/movie/id/${props.match.imdb_id}/`,
        headers: {
          "X-RapidAPI-Key":
            "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
          "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response);
        // eslint-disable-next-line
        if (response.data.results == 0) {
          setIsLoading(false);
          setError("Sorry, we couldn't find any extra info for this title");
        }
        if (response.data.results) {
          setMatchData(response.data.results);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          setError(error.response.data.error);
          setIsLoading(false);
        }
      }
    } else if (props.match.mediaType === "tvSeries") {
      const options = {
        method: "GET",
        url: `https://moviesminidatabase.p.rapidapi.com/series/id/${props.match.imdb_id}/`,
        headers: {
          "X-RapidAPI-Key":
            "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
          "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response);
        // eslint-disable-next-line
        if (response.data.results == 0) {
          setIsLoading(false);
          setError("Sorry, we couldn't find any extra info for this title");
        }
        if (response.data.results) {
          setMatchData(response.data.results);
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          setError(error.response.data.error);
          setIsLoading(false);
        }
      }
    } else {
      setIsLoading(false);
      setError("Sorry, we couldn't find any extra info for this title");
    }
    return;
  };
  return (
    <div className="match-layout">
      <div className="match-title">
        <p>{props.match.name}</p>
        <button
          className="button"
          onClick={handleMoreInfo}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="material-symbols-rounded">pending</span>
          ) : (
            <span className="material-symbols-rounded">
              {openMore ? "do_not_disturb_on" : "add_circle"}
            </span>
          )}
        </button>
      </div>
      {matchData && (
        <div className={openMore ? "show" : "hide"}>
          {matchData.banner ? (
            <img
              className="match-banner"
              src={matchData.banner}
              alt={matchData.title}
            />
          ) : null}
          <p>IMDB Rating: {matchData?.rating}</p>
          <p>Content Rating: {matchData?.content_rating}</p>
          <p>Release Date: {matchData?.release}</p>
          <p>{matchData.description}</p>
          <div className="youtube-holder"><YoutubeEmbed link={matchData?.trailer} /></div>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Match;
