import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Axios from "axios";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await Axios.post(
        "https://film-matcher.herokuapp.com/api/user/login/",
        { email, password }
      );
      console.log(response);

      // save user to local storage
      localStorage.setItem("user", JSON.stringify(response.data));

      // update authContext
      dispatch({ type: "LOGIN", payload: response.data });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.error);
        setIsLoading(false);
      }
    }
  };

  return { login, isLoading, error };
};
