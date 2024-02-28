import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';
import {
  faUser,
  faEnvelope,
  faChartBar,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import './adminhome.css';
import GenralComponent from './GeneralComponent';
import { jwtDecode } from "jwt-decode";
import AdminComponent from './admincomponent';
let LOGOUT_TIME=3600000;




const MainAdminPage = () => {
  const [username,setUsername]=useState("None");
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

  useEffect(() => {
    // Get the token from where you have stored it (e.g., localStorage, cookies)
    const token = sessionStorage.getItem('mainadminToken'); // Change this according to your storage method
  
    if (token) {
      // Decode the token
      const decodedToken = jwtDecode(token);
  
      // Access the username from the decoded token
      const { username } = decodedToken.user;
  
      // Set the username in the component state
      console.log("usernameeee: "+username);
      setUsername(username);
    }
  }, []);
  
  useEffect(() => {
    
  
    const pollingInterval = LOGOUT_TIME;
      const intervalId = setInterval(() => {

      handleLogout(); 
    }, pollingInterval);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 
  
  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('mainadminToken'); 
      sessionStorage.removeItem('mainadminToken'); 
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    
    try {
      await handleLogout();
    } catch (error) {
    }
  
    delete event['returnValue'];
    return;
  });

  const menuIcons = {               
    ManageAdmins: faUser,
    RegisterVehicle: faUser,
    AnnouncementMail: faEnvelope,
    Report: faChartBar,
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
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
            <AdminComponent option={selectedOption} />
          </div>
        ) : (
          <div className="default-content">
            <h1>Welcome to the Admin Dashboard</h1>
            <p>Manage station Admins and Officers with ease!</p>
            <p>Select an option from the menu to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainAdminPage;




