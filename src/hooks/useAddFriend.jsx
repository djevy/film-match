import { useState } from "react";
import Axios from "axios";

export const useAddFriend = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [success, setSuccess] = useState(null);

  const addFriend = async (user, friendsEmail) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await Axios.post(
        `https://film-matcher.herokuapp.com/api/user/addfriends`,
        {"friendsEmail": friendsEmail},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log(response);
      if(response.status === 200) {
        setSuccess(response.data.message)
      }

      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.error);
        setIsLoading(false);
      }
    }
  };

  return { addFriend, isLoading, error, success };
};
