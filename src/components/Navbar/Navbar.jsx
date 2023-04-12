import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Navbar.css";
import Modal from "../Modal/Modal";
import Login from "../Login/Login";
import Signup from "../Signup/Signup";
import MatchCount from "../MatchCount/MatchCount";

import Logo from "../../images/FM_Logo.png";

const Navbar = ({ matches }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleClick = () => {
    logout();
  };

  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleToggle = () => {
    setNavbarOpen(!navbarOpen);
  };
  const closeMenu = () => {
    setNavbarOpen(false);
  };

  const [loginIsOpen, setLoginIsOpen] = useState(false);
  const toggleLoginModal = () => {
    setLoginIsOpen(!loginIsOpen);
  };

  const [signupIsOpen, setSignupIsOpen] = useState(false);
  const toggleSignupModal = () => {
    setSignupIsOpen(!signupIsOpen);
  };
  return (
    <header id="navbar">
      <div>
        <div className="navbar">
          <div className="nav-left">
            <Link to="/">
              <img className="nav-logo" src={Logo} alt="Site logo" />
            </Link>
            <Link to="/">
              <h1>Film Match</h1>
            </Link>
            <Link to="/matches">
              <MatchCount matches={matches} />
            </Link>
          </div>

          <button className="hamburger-button" onClick={handleToggle}>
            {navbarOpen ? (
              <span className="material-symbols-rounded">close</span>
            ) : (
              <span className="material-symbols-rounded">menu</span>
            )}
          </button>

          <nav className={`menuNav ${navbarOpen ? "showMenu" : ""}`}>
            {user ? (
              <div>
                <Link to="/">
                  <img
                    className="hamburger-logo"
                    src={Logo}
                    alt="Site logo"
                    onClick={closeMenu}
                  />
                </Link>
                <div className="home-grid">
                  <Link to="/dashboard" onClick={closeMenu}>
                    Dashboard
                    <span className="material-symbols-rounded">
                      movie_filter
                    </span>
                  </Link>
                  <Link to="/matches" onClick={closeMenu}>
                    Matches{" "}
                    <span className="material-symbols-rounded">favorite</span>
                  </Link>
                  <Link to="/history" onClick={closeMenu}>
                    History{" "}
                    <span className="material-symbols-rounded">history</span>
                  </Link>
                  <Link to="/friends" onClick={closeMenu}>
                    Friends{" "}
                    <span className="material-symbols-rounded">group</span>
                  </Link>
                </div>
                <span className="nav-element">{user.email}</span>
                <button
                  className="nav-element glow-button"
                  onClick={() => {
                    handleClick();
                    closeMenu();
                  }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div>
                <button
                  className="nav-element glow-button"
                  onClick={() => {
                    toggleLoginModal();
                    closeMenu();
                  }}
                >
                  Login
                </button>
                <Modal isOpen={loginIsOpen} toggleModal={toggleLoginModal}>
                  <Login />
                </Modal>

                <button
                  className="nav-element glow-button"
                  onClick={() => {
                    toggleSignupModal();
                    closeMenu();
                  }}
                >
                  Sign up
                </button>
                <Modal isOpen={signupIsOpen} toggleModal={toggleSignupModal}>
                  <Signup />
                </Modal>
              </div>
            )}
            {/* </nav> */}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
