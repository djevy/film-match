import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../../components/Modal/Modal";
import Signup from "../../components/Signup/Signup";
import Login from "../../components/Login/Login";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuthContext();

  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const toggleLoginModal = () => {
    setLoginIsOpen(!loginIsOpen);
  };

  const [signupIsOpen, setSignupIsOpen] = useState(false);
  const toggleSignupModal = () => {
    setSignupIsOpen(!signupIsOpen);
  };
  return (
    <div>
      {user ? (
        <div className="home-layout">
          <div>Welcome</div>
          <Link to="/dashboard">Dashboard</Link>
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
