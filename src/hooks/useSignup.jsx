import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import Axios from "axios";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password, confirmPassword) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await Axios.post(
        "http://localhost:4000/api/user/signup/",
        { email, password, confirmPassword }
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

  return { signup, isLoading, error };
};
