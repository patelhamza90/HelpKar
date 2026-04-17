import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Header() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const userToken = localStorage.getItem("userToken");
  const workerToken = localStorage.getItem("workerToken");

  const isLoggedIn = userToken || workerToken;

  const [userName, setUserName] = useState(null);

  const profileRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userToken");
    localStorage.removeItem("workerToken");
    localStorage.removeItem("workerName");

    setUserName(null);
    navigate("/login");
  };

  useEffect(() => {

    const handleClickOutside = (event) => {

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

  }, []);
  useEffect(() => {
    const workerToken = localStorage.getItem("workerToken");

    if (workerToken) {
      setUserName(localStorage.getItem("workerName"));
    } else {
      setUserName(localStorage.getItem("loggedInUser"));
    }
  }, []);
  useEffect(() => {

    const updateUser = () => {
      const workerToken = localStorage.getItem("workerToken");

      if (workerToken) {
        setUserName(localStorage.getItem("workerName"));
      } else {
        setUserName(localStorage.getItem("loggedInUser"));
      }
    };

    window.addEventListener("userUpdated", updateUser);

    return () => {
      window.removeEventListener("userUpdated", updateUser);
    };

  }, []);

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        Help<span className="kar-text">Kar</span>
      </div>

      {/* Navigation Links */}
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        <NavLink to="/" className="nav-item">
          Home
        </NavLink>

        <NavLink to="/services" className="nav-item">
          Services
        </NavLink>

        <NavLink to="/about" className="nav-item">
          About Us
        </NavLink>

        <NavLink to="/contact" className="nav-item">
          Contact Us
        </NavLink>
      </div>

      {/* USER PROFILE */}

      <div className="profile-container" ref={profileRef}>

        <div className="profile-btn" onClick={toggleProfile}>
          Welcome, {userName ? userName : "Guest"}
          <span>
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>

        {profileOpen && (
          <div className="profile-dropdown">

            {isLoggedIn ? (
              <>
                {!workerToken && <NavLink to="/user-dashboard">My Profile</NavLink>}

                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
              </>
            )}

          </div>
        )}

      </div>

      {/* Hamburger */}
      <div className="hamburger" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

    </nav>
  );
}

export default Header;