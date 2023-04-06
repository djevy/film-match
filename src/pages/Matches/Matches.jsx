import React from "react";
import Match from "../../components/Match/Match";

const Matches = ({matches, setMatches}) => {

  return (
    <div>
      <h3>Matches</h3>
      <h4>This is what you and your friend both want to watch</h4>
      {matches ? matches?.map((match, id) => {
        return <Match key={id} match={match}></Match>
      }) : <p>No matches yet. Get swiping!</p>}
    </div>
  );
};

export default Matches;
