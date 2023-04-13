import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Home.css";

const Home = ({ setMatches }) => {
  const { user } = useAuthContext();

  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const toggleLoginModal = () => {
    setLoginIsOpen(!loginIsOpen);
  };

  const [signupIsOpen, setSignupIsOpen] = useState(false);
  const toggleSignupModal = () => {
    setSignupIsOpen(!signupIsOpen);
  };
  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await axios.get(
          "https://film-matcher.herokuapp.com/api/user/findmatches",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        // console.log(response);
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
      {user ? (
        <div className="home-layout">
          <h3>Get Swiping!</h3>
          <div className="home-grid">
            <Link to="/dashboard">
              Dashboard
              <span className="material-symbols-rounded">movie_filter</span>
            </Link>
            <Link to="/matches">
              Matches <span className="material-symbols-rounded">favorite</span>
            </Link>
            <Link to="/history">
              History <span className="material-symbols-rounded">history</span>
            </Link>
            <Link to="/friends">
              Friends <span className="material-symbols-rounded">group</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="home-layout">
          <div className="tagline">Find a film no fuss</div>

          <button
            className="glow-button mobile-button"
            onClick={toggleLoginModal}
          >
            Log in
          </button>
          <Modal isOpen={loginIsOpen} toggleModal={toggleLoginModal}>
            <Login />
          </Modal>

          <button className="glow-button" onClick={toggleSignupModal}>
            Create an account
          </button>
          <Modal isOpen={signupIsOpen} toggleModal={toggleSignupModal}>
            <Signup />
          </Modal>
        </div>
      )}
    </div>
  );
};

export default Home;
