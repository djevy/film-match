import React from "react";
import Axios from "axios";
import { useSwipesContext } from "../../hooks/useSwipesContext";
import { useAuthContext } from "../../hooks/useAuthContext";

const SwipedCards = ({ swipe }) => {
  const { dispatch } = useSwipesContext();
  const { user } = useAuthContext();
  const handleDeleteClick = async () => {
    if (!user) {
      return;
    }

    try {
      const response = await Axios.delete(
        `http://localhost:4000/api/swipes/${swipe._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const data = response.data.swipe;
      dispatch({ type: "DELETE_SWIPE", payload: data });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="swiped-cards">
      <h4>{swipe.name}</h4>
      <p>
        <strong>Opinion: </strong>
        {swipe.liked ? (
          <span className="material-symbols-outlined">thumb_up</span>
        ) : (
          <span className="material-symbols-outlined">thumb_down</span>
        )}
      </p>
      <p>
        {/* {formatDistanceToNow(new Date(swipe.createdAt), { addSuffix: true })} */}
      </p>
      <span className="material-symbols-outlined" onClick={handleDeleteClick}>
        delete
      </span>
    </div>
  );
};

export default SwipedCards;
