import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faEnvelope,
  faChartBar,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import './adminhome.css';
import GenralComponent from './GeneralComponent';
import { jwtDecode } from "jwt-decode";



const MainAdminPage = () => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("mainadminToken"); // Retrieve the token from where you store it
    console.log(token);

  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      console.log("Decoded Token:", decodedToken);
      
      // Now you can access the decoded information like decodedToken.user.username
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
}, []);
  const handleOptionClick = async (option) => {
    setSelectedOption(option);
  };

  const menuIcons = {               
    ManageOfficers: faUser,
    AnnouncementMail: faEnvelope,
    Report: faChartBar,
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = async () => {
    // Your logout logic here
  };



  return (
    <div className={`admin-page ${menuVisible ? '' : 'collapsed'}`}>
      <div className="menu-container">
        <div className="logo">
          {/* <h1>Admin Dashboard</h1> */}
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>

      <div className={`side-menu ${menuVisible ? '' : 'hidden'}`}>
        <div className="menu-items">
          {Object.keys(menuIcons).map((option) => (
            <div
              className={`menu-item ${selectedOption === option ? 'active' : ''}`}
              key={option}
              onClick={() => handleOptionClick(option)}
            >
              <FontAwesomeIcon icon={menuIcons[option]} className="menu-icon" />
              <span className="menu-name">{option.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <button className="right-oriented-logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span> Logout</span>
          </button>
        </div>

        {selectedOption ? (
          <div className="selected-option">
            <GenralComponent option={selectedOption} />
          </div>
        ) : (
          <div className="default-content">
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Manage your educational institution efficiently with ease!</p>
            <p>Select an option from the menu to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainAdminPage;




