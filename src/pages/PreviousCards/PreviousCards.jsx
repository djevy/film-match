import { useEffect } from "react";
import axios from "axios";
import { useSwipesContext } from "../../hooks/useSwipesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

import "./PreviousCards.css"

import SwipedCards from "../../components/SwipedCards/SwipedCards";

const PreviousCards = () => {
  const { swipes, dispatch } = useSwipesContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const getSwipes = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/swipes", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        console.log(response);
        dispatch({ type: "SET_SWIPE", payload: response.data });
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      getSwipes();
    }
  }, [dispatch, user]);
  return (
    <div>
      PreviousCards
      <div className="swiped-card-layout">
        {swipes &&
          swipes.map((swipe) => (
            <SwipedCards key={swipe._id} swipe={swipe} />
          ))}
      </div>
    </div>
  );
};

export default PreviousCards;
