import React, { useEffect } from "react";
import axios from "axios";
import AddFriend from "../../components/AddFriend/AddFriend";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";

const Friends = () => {
  const [friends, setFriends] = useState("");
  const { user } = useAuthContext();
  useEffect(() => {
    const getFriends = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/user/getfriends",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setFriends(response.data.friendEmails);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      getFriends();
    }
  }, [user]);
  return (
    <div className="page-layout">
      <h3>Friends</h3>
      {friends && friends?.map((friend, id) => {
        return <p key={id}>{friend}</p>
      })}
      <AddFriend />
    </div>
  );
};

export default Friends;
