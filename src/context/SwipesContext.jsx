import { createContext, useReducer } from "react";

export const SwipesContext = createContext();

export const swipesReducer = (state, action) => {
  switch (action.type) {
    case "SET_SWIPE":
      return {
        swipes: action.payload,
      };
    case "CREATE_SWIPE":
      return {
        swipes: [action.payload, ...state.swipes],
      };
    case "DELETE_SWIPE":
      return {
        swipes: state.swipes.filter(
          (swipe) => swipe._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const SwipesContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(swipesReducer, {
    swipes: null,
  });
  return (
    <SwipesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </SwipesContext.Provider>
  );
};
