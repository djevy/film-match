import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SwipesContextProvider } from "./context/SwipesContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SwipesContextProvider>
        <App />
      </SwipesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
