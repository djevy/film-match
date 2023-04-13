import React, { useEffect } from "react";
import axios from "axios";
import Match from "../../components/Match/Match";
import { useAuthContext } from "../../hooks/useAuthContext";

const Matches = ({ matches, setMatches }) => {
  const { user } = useAuthContext();
  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await axios.get(
          "https://film-matcher.herokuapp.com/api/user/findmatches",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setMatches(response.data.matchedSwipes);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // token has expired, log user out
          localStorage.removeItem("user");
          // setUser(null);
        } else {
          console.error(error);
        }
      }
    };

    if (user) {
      getMatches();
    }
  }, [user]);

  return (
    <div className="page-layout">
      <h3>Matches</h3>
      <h4>This is what you and your friend both want to watch</h4>
      {matches ? (
        matches?.map((match, id) => {
          return <Match key={id} match={match}></Match>;
        })
      ) : (
        <p>No matches yet. Get swiping!</p>
      )}
    </div>
  );
};

export default Matches;
