import { SwipesContext } from "../context/SwipesContext";
import { useContext } from "react";

export const useSwipesContext = () => {
    const context = useContext(SwipesContext);

    if (!context) {
        throw Error("useSwipesContext must be used within SwipesContextProvider");
    }

    return context;
}