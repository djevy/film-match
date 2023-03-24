import React, { useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./Dashboard.css";
import Modal from "../../components/Modal/Modal";
import SearchSettings from "../../components/SearchSettings/SearchSettings";
import Popcorn from "../../images/popcorn.jpg";

const Dashboard = () => {
  const [cards, setCards] = useState([
    { id: "1", name: "Set some options first", url: Popcorn },
  ]);
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const toggleSettingsModal = () => {
    setSettingsIsOpen(!settingsIsOpen);
  };
  const [showDetails, setShowDetails] = useState();
  const toggleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const [page, setPage] = useState("1");

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
            page={page}
            setPage={setPage}
            setCurrentIndex={setCurrentIndex}
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
            <p>
              Release Date:{" "}
              {cards[currentIndex]?.releaseDate?.day &&
                cards[currentIndex]?.releaseDate?.day + "/"}
              {cards[currentIndex]?.releaseDate?.month &&
                cards[currentIndex]?.releaseDate?.month + "/"}
              {cards[currentIndex]?.releaseDate?.year}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
