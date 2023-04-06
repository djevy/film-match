import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Home.css";

const Home = ({setMatches}) => {
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
          "http://localhost:4000/api/user/findmatches",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        console.log(response);
        if (response.status === 200) {
          setMatches(response.data.matchedSwipes);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      getMatches();
    }
  }, [user]);
  return (
    <div>
      {user ? (
        <div className="home-layout">
          <div>Welcome</div>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/history">History</Link>
          <Link to="/friends">Friends</Link>
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

      {/* <Modal isOpen={isOpen} toggleModal={toggleModal}>
        <Login/>
      </Modal> */}
    </div>
  );
};

export default Home;
