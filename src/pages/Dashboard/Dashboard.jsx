import React, { useState, useRef, useMemo } from "react";
import TinderCard from "react-tinder-card";
import "./Dashboard.css";
import Modal from "../../components/Modal/Modal";
import SearchSettings from "../../components/SearchSettings/SearchSettings";

const db = [
  {
    name: "Shrek",
    url: "./img/Shrek.jpg",
  },
  {
    name: "Shrek 2",
    url: "./img/Shrek2.jpg",
  },
  {
    name: "Puss in Boots",
    url: "./img/PussInBoots.jpg",
  },
  {
    name: "Lilo & Stitch",
    url: "./img/LiloStitch.jpg",
  },
  {
    name: "The Incredibles",
    url: "./img/TheIncredibles.jpg",
  },
];

const Dashboard = () => {
  const [settingsIsOpen, setSettingsIsOpen] = useState(false);
  const toggleSettingsModal = () => {
    setSettingsIsOpen(!settingsIsOpen);
  };

  const [currentIndex, setCurrentIndex] = useState(db.length - 1);
  const [lastDirection, setLastDirection] = useState();
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map((i) => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;

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
    if (canSwipe && currentIndex < db.length) {
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
        <span
          id="search-icon"
          className="material-symbols-outlined"
          onClick={toggleSettingsModal}
        >
          settings
        </span>
        <Modal isOpen={settingsIsOpen} toggleModal={toggleSettingsModal}>
          <SearchSettings />
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
          Swipe left!
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
          Swipe right!
        </button>
      </div>
      <div className="cardContainer">
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: "url(" + character.url + ")" }}
              className="card"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>

      <div>
        <h3>Details</h3>
      </div>
    </div>
  );
};

export default Dashboard;
