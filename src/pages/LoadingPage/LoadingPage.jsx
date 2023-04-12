import React from "react";
import { CircleLoader } from "react-spinners";
import "./LoadingPage.css";
import Logo from "../../images/FM_Logo.png";

const LoadingPage = ({ loading }) => {
  return (
    <div className="loading-page">
      <img className="loading-logo" src={Logo} alt="App logo" />
      
      <p id="loading-title">Find A Film Fast</p>
      <CircleLoader color="goldenrod" loading={loading} size={60} />
      <p>Loading...</p>
      <p id="loading-name">Darren R Evans</p>
    </div>
  );
};

export default LoadingPage;
