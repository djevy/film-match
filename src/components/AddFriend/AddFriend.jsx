import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useState } from "react";
import "./AddFriend.css";
import { useAddFriend } from "../../hooks/useAddFriend";

const AddFriend = () => {
  const { addFriend, error, isLoading, success } = useAddFriend();
  const { user } = useAuthContext();
  const [friendEmail, setFriendEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addFriend(user, friendEmail);
  };
  return (
    <form onSubmit={handleSubmit} className="add-friend-form">
      <div className="friend-email-input">
        <label htmlFor="friendEmail">Friends Email</label>
        <input
          type="text"
          id="friendEmail"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
        />
      </div>
      <button className="button" disabled={isLoading}>
        Add Friend
      </button>
      {success && <div className="success">{success}</div>}
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default AddFriend;
