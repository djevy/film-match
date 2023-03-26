import React, { useState, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import TinderCard from "react-tinder-card";
import "./Dashboard.css";
import Modal from "../../components/Modal/Modal";
import SearchSettings from "../../components/SearchSettings/SearchSettings";
import Popcorn from "../../images/popcorn.jpg";
import Space from "../../images/space.jpg";
import YoutubeEmbed from "../../components/YoutubeEmbed/YoutubeEmbed";

const Dashboard = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [cards, setCards] = useState([
    { id: "1", name: "Set some options first", url: Popcorn },
  ]);

  const [titleType, setTitleType] = useState("movie");
  const [searchType, setSearchType] = useState("top_boxoffice_200");
  const [genreType, setGenreType] = useState();
  const [year, setYear] = useState();

  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const toggleSettingsModal = () => {
    setSettingsIsOpen(!settingsIsOpen);
  };
  const [showDetails, setShowDetails] = useState();
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const [page, setPage] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(cards.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(cards.length)
        .fill(0)
        .map((i) => React.createRef()),
    [cards.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < cards.length - 1;

  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    handleNext();
    console.log(currentIndex);
    setError(null);
    if (canSwipe && currentIndex < cards.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
  };
  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const searchOptions = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles",
      params: {
        genre: genreType,
        year: year,
        page: page,
        list: searchType === "any" ? null : searchType,
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
            releaseDate: result?.releaseDate,
            mediaType: result?.titleType.id,
          });
        });
        setCards(newCards);
        setCurrentIndex(newCards.length - 1);

        // const newArray = newCards.concat(props.cards);
        // props.setCards(newArray);
        // props.setCurrentIndex(newArray.length - 1);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.error);
        setIsLoading(false);
      }
    }
  }, [genreType, page, searchType, titleType, year]);

  const handleMoreInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    if (cards[currentIndex].mediaType === "movie") {
      const options = {
        method: "GET",
        url: `https://moviesminidatabase.p.rapidapi.com/movie/id/${cards[currentIndex].id}/`,
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
          cards[currentIndex].content_rating =
            response.data.results.content_rating;
          cards[currentIndex].rating = response.data.results.rating;
          cards[currentIndex].description = response.data.results.description;
          cards[currentIndex].trailer = response.data.results.trailer;
          setIsLoading(false);
        }
      } catch (error) {
        console.error(error);
        if (error.response) {
          setError(error.response.data.error);
          setIsLoading(false);
        }
      }
    } else if (cards[currentIndex].mediaType === "tvSeries") {
      const options = {
        method: "GET",
        url: `https://moviesminidatabase.p.rapidapi.com/series/id/${cards[currentIndex].id}/`,
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
          cards[currentIndex].content_rating =
            response.data.results.content_rating;
          cards[currentIndex].rating = response.data.results.rating;
          cards[currentIndex].description = response.data.results.description;
          cards[currentIndex].trailer = response.data.results.trailer;
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
  // useEffect(() => {
  //   if (currentIndex === 0) {
  //     setPage(page + 1);
  //     handleSearch()
  //   }
  // }, [currentIndex, page, handleSearch]);
  const handleNext = useCallback(() => {
    if (currentIndex === 0) {
      setPage(page + 1);
      handleSearch();
    }
  }, [page, handleSearch, currentIndex]);

  return (
    <div className="dashboard">
      {/* <h2>Dashboard</h2> */}

      <div className="settings-container">
        <p onClick={toggleSettingsModal}>Search Options</p>
        <span
          id="search-icon"
          className="material-symbols-outlined"
          onClick={toggleSettingsModal}
        >
          settings
        </span>
        <Modal isOpen={settingsIsOpen} toggleModal={toggleSettingsModal}>
          <SearchSettings
            setCards={setCards}
            cards={cards}
            page={page}
            setPage={setPage}
            setCurrentIndex={setCurrentIndex}
            titleType={titleType}
            setTitleType={setTitleType}
            searchType={searchType}
            setSearchType={setSearchType}
            year={year}
            setYear={setYear}
            genreType={genreType}
            setGenreType={setGenreType}
            handleSearch={handleSearch}
          />
        </Modal>
      </div>

      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">Start swiping!</h2>
      )}
      <div className="swipe-buttons">
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("left")}
        >
          <span className="material-symbols-outlined">thumb_down</span>
        </button>
        <button
          style={{ backgroundColor: !canGoBack && "#c3c4d3" }}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          style={{ backgroundColor: !canSwipe && "#c3c4d3" }}
          onClick={() => swipe("right")}
        >
          <span className="material-symbols-outlined">thumb_up</span>
        </button>
      </div>
      <div className="cardContainer">
        {cards.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.id}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="card"
            >
              {/* <h3>{character.name}</h3> */}
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="card-details-container">
        <h3 onClick={toggleShowDetails}>
          Details{" "}
          <span className="material-symbols-outlined">
            {showDetails ? "expand_more" : "expand_less"}
          </span>
        </h3>
        <div className={`card-details ${showDetails ? "hide-details" : ""}`}>
          <h4>{cards[currentIndex]?.name}</h4>
          {cards[currentIndex]?.releaseDate && (
            <div>
              <p>
                Release Date:{" "}
                {cards[currentIndex]?.releaseDate?.day &&
                  cards[currentIndex]?.releaseDate?.day + "/"}
                {cards[currentIndex]?.releaseDate?.month &&
                  cards[currentIndex]?.releaseDate?.month + "/"}
                {cards[currentIndex]?.releaseDate?.year}
              </p>
              {cards[currentIndex]?.content_rating && (
                <p>Content Ratings: {cards[currentIndex]?.content_rating}</p>
              )}
              {cards[currentIndex]?.rating && (
                <p>IMDB Score: {cards[currentIndex]?.rating}</p>
              )}
              {cards[currentIndex]?.description && (
                <div>
                  <p>Description: </p>
                  <p>{cards[currentIndex]?.description}</p>
                </div>
              )}
              {cards[currentIndex]?.trailer && <YoutubeEmbed link={cards[currentIndex]?.trailer}/>}
              <button
                className="button"
                onClick={handleMoreInfo}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="material-symbols-outlined">pending</span>
                ) : (
                  "More..."
                )}
              </button>
              {error && <p className="error">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
