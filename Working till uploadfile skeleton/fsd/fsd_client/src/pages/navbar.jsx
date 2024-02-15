// Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '@mui/material/Button';
import { faUpload, faEye, faChartBar, faQuestion,faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './navbar.css'; 

const Navbar = () => {
  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clearing local storage or calling a logout API
    console.log('Logout clicked!');
  };

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
