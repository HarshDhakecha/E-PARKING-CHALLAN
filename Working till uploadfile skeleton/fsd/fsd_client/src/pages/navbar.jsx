// Navbar.jsx
import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { jwtDecode } from 'jwt-decode';
import Button from '@mui/material/Button';
import { faUpload, faEye, faChartBar, faQuestion,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './navbar.css'; 
let LOGOUT_TIME=3600000;


const Navbar = () => {
  const [username,setUsername]=useState("None");

  useEffect(() => {
    // Get the token from where you have stored it (e.g., localStorage, cookies)
    const token = sessionStorage.getItem('officerToken'); // Change this according to your storage method
  
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
  
    // Setup polling with setInterval
    const intervalId = setInterval(() => {
      handleLogout(); // Fetch data at regular intervals
    }, pollingInterval);
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []); 
  
  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('officerToken'); // Get the authToken from sessionStorage
      sessionStorage.removeItem('userToken'); // Clear the authToken from sessionStorage
  
      // Redirect or perform other actions after logout
      window.location.href = '/memo_login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  window.addEventListener('beforeunload', async (event) => {
    event.preventDefault();
    
    try {
      await handleLogout();
    } catch (error) {
      // Handle errors, if any
    }
  
    // Standard for most browsers
    delete event['returnValue'];
    // For some older browsers
    return;
  });

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">E-Parking Challan</Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link to="/memo_home">Home</Link>
        </li>
        <li>
          <Link to="/pay">Pay Memo</Link>
        </li>
        <li>
          <Link to="/personhistory">Payment History</Link>
        </li>
        {/* Add more links as needed */}
      </ul>
      <Button
                variant="contained"
                onClick={handleLogout}
                className="logout-button"
                style={{
                  background: 'transparent',
                  color: '#fff', 
                  border: 'none',
                  borderRadius: '5px',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease',
                  background: '#007BFF',
                }}
                startIcon={<FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />}
              >
                Logout
              </Button>
    </nav>
  );
};

export default Navbar;
