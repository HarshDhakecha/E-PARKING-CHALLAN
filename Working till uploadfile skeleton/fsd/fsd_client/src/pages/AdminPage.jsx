import React, { useState } from 'react';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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

const AdminPage = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [menuVisible, setMenuVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleOptionClick = async (option) => {
    setSelectedOption(option);
    setSelectedFile(null);

    if (option === 'addStudent') {
      console.log(option);
    }
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
    try {
      const adminToken = sessionStorage.getItem('adminToken'); // Get the authToken from sessionStorage
      await axios.post(`${process.env.REACT_APP_API_URL}/alogout`, null, {
        headers: {
          Authorization: `Bearer ${adminToken}`, // Add the token to the headers
        },
      });
  
      sessionStorage.removeItem('adminToken'); // Clear the authToken from sessionStorage
  
      // Redirect or perform other actions after logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
  <button className="right-oriented-logout-button" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
      <span> Logout</span>
    </button>

    <div className="admin-page">
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <div className={`side-menu ${menuVisible ? '' : 'hidden'}`}>
        <div className="menu-items">
          {/* Menu title below the three-line button */}
          <div className="menu-title">Menu</div>
                      
          {/* Menu items */}
          {Object.keys(menuIcons).map((option) => (
            <div className="menu-item" key={option} onClick={() => handleOptionClick(option)}>
              <FontAwesomeIcon icon={menuIcons[option]} className="menu-icon" />
              <span className="menu-name">{option.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {selectedOption ? (
          <div className="selected-option">
           
            <GenralComponent option={selectedOption}/>
            
        
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
    </div>
  );
};

export default AdminPage;