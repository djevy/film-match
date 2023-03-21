import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import "./Navbar.css";

const Navbar = () => {
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
  return (
    <header id="navbar">
      <div id="desktop">
        <div className="navbar">
          <Link to="/">
            <h1>Film Match</h1>
          </Link>
          <nav className="nav-login">
            {user ? (
              <div>
                <span className="nav-element">{user.email}</span>
                <button
                  className="nav-element glow-button"
                  onClick={handleClick}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div>
                <Link className="nav-element glow-button" to="/login">
                  Log in
                </Link>
                <Link className="nav-element glow-button" to="/signup">
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
      <div id="mobile">
        <div className="navbar">
          <Link to="/">
            <h1>Film Match</h1>
          </Link>

          <button className="hamburger-button" onClick={handleToggle}>
            {navbarOpen ? (
              <span className="material-symbols-outlined">close</span>
            ) : (
              <span className="material-symbols-outlined">menu</span>
            )}
          </button>

          <nav className={`menuNav ${navbarOpen ? "showMenu" : ""}`}>
            {/* <nav className="nav-login"> */}
              {user ? (
                <div>
                  <span className="nav-element">{user.email}</span>
                  <button
                    className="nav-element glow-button"
                    onClick={() => {handleClick(); closeMenu();}}
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div>
                  <Link className="nav-element glow-button" to="/login" onClick={closeMenu}>
                    Log in
                  </Link>
                  <Link className="nav-element glow-button" to="/signup" onClick={closeMenu}>
                    Sign up
                  </Link>
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
