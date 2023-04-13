import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import TinderCard from "react-tinder-card";
import "./Dashboard.css";

import Modal from "../../components/Modal/Modal";
import SearchSettings from "../../components/SearchSettings/SearchSettings";
import YoutubeEmbed from "../../components/YoutubeEmbed/YoutubeEmbed";
import { useSwipesContext } from "../../hooks/useSwipesContext";

import { useAuthContext } from "../../hooks/useAuthContext";

import Popcorn from "../../images/popcorn.jpg";
import Space from "../../images/space.jpg";
import Loading from "../../images/loading.gif";

const Dashboard = () => {
  const { dispatch } = useSwipesContext();
  const { user } = useAuthContext();

  const [swipedCards, setSwipedCards] = useState([]);
  const [error, setError] = useState(null);
  const [searchError, setSearchError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [openMore, setOpenMore] = useState(false);
  const [cards, setCards] = useState([
    { imdb_id: "1", name: "Set some options first", url: Popcorn },
  ]);

  const [searchTypes, setSearchTypes] = useState([
    "most_pop_movies",
    "top_boxoffice_200",
    "top_boxoffice_last_weekend_10",
    "top_rated_250",
    "top_rated_english_250",
    "top_rated_lowest_100",
    "titles",
  ]);
  const [titleType, setTitleType] = useState("movie");
  const [searchType, setSearchType] = useState("top_boxoffice_200");
  const [genreType, setGenreType] = useState();
  const [year, setYear] = useState();

  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const toggleSettingsModal = () => {
    setSettingsIsOpen(!settingsIsOpen);
  };
  const [showDetails, setShowDetails] = useState(true);
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  // Get previous swipes
  useEffect(() => {
    const getSwipes = async () => {
      try {
        const response = await axios.get("https://film-matcher.herokuapp.com/api/swipes", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // console.log(response);
        dispatch({ type: "SET_SWIPE", payload: response.data });
        setSwipedCards(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      getSwipes();
    }
  }, [dispatch, user]);
  // console.log("swipedCards", swipedCards);
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
    // console.log(currentIndex);
    // console.log(cards[currentIndex]);
    if (dir === "right") {
      cards[currentIndex].liked = true;
      setSwipedCards([...swipedCards, cards[currentIndex]]);
    } else if (dir === "left") {
      cards[currentIndex].liked = false;
      setSwipedCards([...swipedCards, cards[currentIndex]]);
    }
    handleSwipeSubmit(cards[currentIndex]);
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
    setSearchError(null);

    const searchOptions = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles",
      params: {
        genre: genreType === "any" ? null : genreType,
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
      // console.log(response);
      if (!response.data.entries > 0) {
        setSearchError("Sorry, there are no results for this search");
        setIsLoading(false);
        throw Error("Sorry, there are no results for this search");
      }
      if (response.data.results) {
        const newCards = [];
        // Filter out already swiped cards from the database
        const newItems = response.data.results.filter(
          (item) =>
            !swipedCards.find((swipedCard) => swipedCard.imdb_id === item.id)
        );
        if (newItems.length === 0) {
          setNoNewCards(true);
        }

        // console.log("newItems", newItems);
        newItems.forEach((result) => {
          // console.log(result);
          newCards.push({
            imdb_id: result?.id,
            name: result?.titleText?.text,
            url: result?.primaryImage?.url ?? Space,
            releaseDate: result?.releaseDate,
            mediaType: result?.titleType.id,
          });
        });
        setSettingsIsOpen(false);
        setCards(newCards.slice());
        // console.log("cards", cards);
        setCurrentIndex(newCards.length - 1);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setSearchError(error.response.data.error);
        setIsLoading(false);
      }
    }
  }, [genreType, page, searchType, titleType, year, swipedCards, cards]);
  const [noNewCards, setNoNewCards] = useState(false);
  if (noNewCards === true) {
    setNoNewCards(false);
    setPage(page + 1);
    handleSearch();
  }

  const handleMoreInfo = async (e) => {
    e.preventDefault();
    setOpenMore(!openMore);
    if(cards[currentIndex].rating) {
      return
    }
    
    setIsLoading(true);
    setError(null);
    if (cards[currentIndex].mediaType === "movie") {
      const options = {
        method: "GET",
        url: `https://moviesminidatabase.p.rapidapi.com/movie/id/${cards[currentIndex].imdb_id}/`,
        headers: {
          "X-RapidAPI-Key":
            "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
          "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        // console.log(response);
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
        url: `https://moviesminidatabase.p.rapidapi.com/series/id/${cards[currentIndex].imdb_id}/`,
        headers: {
          "X-RapidAPI-Key":
            "abf202e9e2msh0d21a021c55dbeap102e27jsna872cc6f8c54",
          "X-RapidAPI-Host": "moviesminidatabase.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        // console.log(response);
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
  const handleNext = useCallback(() => {
    if (currentIndex === 0) {
      setPage(page + 1);
      handleSearch();
    }
  }, [page, handleSearch, currentIndex]);

  // Send swipes to database
  const handleSwipeSubmit = async (swipe) => {
    setOpenMore(false);
    if (swipe.imdb_id === "1") return;
    if (!user) {
      setError("Please login");
      return;
    }
    // console.log("swipe", swipe);

    const { name, imdb_id, mediaType, liked } = swipe;

    try {
      const response = await axios.post(
        "https://film-matcher.herokuapp.com/api/swipes",
        { name, imdb_id, mediaType, liked },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      dispatch({ type: "CREATE_SWIPE", payload: response.data.swipe });

      // console.log(response);
    } catch (error) {
      console.error(error);
      if (error.response.data) {
        setError(error.response.data.error);
      }
    }
  };

  return (
    <div className="dashboard page-layout">
      <div className="settings-container">
        <p onClick={toggleSettingsModal}>Search Options</p>
        <span
          id="search-icon"
          className="material-symbols-rounded"
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
            searchTypes={searchTypes}
            setSearchTypes={setSearchTypes}
            year={year}
            setYear={setYear}
            genreType={genreType}
            setGenreType={setGenreType}
            handleSearch={handleSearch}
            searchError={searchError}
            setSearchError={setSearchError}
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
          <span className="material-symbols-rounded">thumb_down</span>
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
          <span className="material-symbols-rounded">thumb_up</span>
        </button>
      </div>
      <div className="cardContainer">
        {cards.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.imdb_id}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              className="card"
            >
              {character.url ? (
                <img src={character.url} alt="" />
              ) : (
                <img src={Loading} alt="" />
              )}
            </div>
          </TinderCard>
        ))}
      </div>

      <div className="card-details-container">
        <h3 onClick={toggleShowDetails}>
          Details{" "}
          <span className="material-symbols-rounded">
            {showDetails ? "expand_more" : "expand_less"}
          </span>
        </h3>
        <div className={`card-details ${showDetails ? "show" : "hide"}`}>
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
              <div className={`more-details ${openMore ? "show" : "hide"}`}>
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
                {cards[currentIndex]?.trailer && (
                  <YoutubeEmbed link={cards[currentIndex]?.trailer} />
                )}
              </div>
              {isLoading ? (
                <button
                  className="button more-button"
                  onClick={handleMoreInfo}
                  disabled={isLoading}
                >
                  <span className="material-symbols-rounded">pending</span>
                </button>
              ) : (
                <button
                  className="button more-button"
                  onClick={handleMoreInfo}
                  disabled={isLoading}
                >
                  <span className="material-symbols-rounded">
                    {openMore ? "do_not_disturb_on" : "add_circle"}
                  </span>
                </button>
              )}
              {error && <p className="error">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
