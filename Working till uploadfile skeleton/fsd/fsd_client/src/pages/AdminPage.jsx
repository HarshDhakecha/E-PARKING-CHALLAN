import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import logo from './menu.png'
import {
  faUser,
  faChalkboardTeacher,
  faFileAlt,
  faEnvelope,
  faChartBar,
  faUserSlash
} from '@fortawesome/free-solid-svg-icons'
import './adminhome.css'
import GenralComponent from './GeneralComponent'
import { jwtDecode } from 'jwt-decode'
let LOGOUT_TIME = 3600000

const AdminPage = () => {
  const [username, setUsername] = useState('None')
  const [selectedOption, setSelectedOption] = useState(null)
  const [menuVisible, setMenuVisible] = useState(true)
  const [showOptions, setShowOptions] = useState(false)

  const handleImageClick = () => {
    setShowOptions(!showOptions)
  }

  const handleOptionClick = async option => {
    setSelectedOption(option)
  }

  useEffect(() => {
    const pollingInterval = LOGOUT_TIME

    // Setup polling with setInterval
    const intervalId = setInterval(() => {
      handleLogout() // Fetch data at regular intervals
    }, pollingInterval)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const handleLogout = async () => {
    try {
      const authToken = sessionStorage.getItem('adminToken') // Get the authToken from sessionStorage
      sessionStorage.removeItem('adminToken') // Clear the authToken from sessionStorage

      // Redirect or perform other actions after logout
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }
  window.addEventListener('beforeunload', async event => {
    event.preventDefault()

    try {
      await handleLogout()
    } catch (error) {
      // Handle errors, if any
    }

    // Standard for most browsers
    delete event['returnValue']
    // For some older browsers
    return
  })

  useEffect(() => {
    const token = sessionStorage.getItem('adminToken') // Retrieve the token from where you store it
    console.log(token)

    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        console.log('Decoded Token:', decodedToken)

        // Now you can access the decoded information like decodedToken.user.username
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const menuIcons = {
    ManageOfficers: faUser,
    AnnouncementMail: faEnvelope,
    Report: faChartBar
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  return (
    <div className='main-container'>
      <motion.div
        className='sidebar-container'
        animate={{ opacity: showOptions ? 1 : 0, x: showOptions ? 0 : -10 }}
      >
        {showOptions && (
          <div>
            <div className='logo-container'>E-Parking Challan</div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('ManageOfficers')}
            >
              Manage Officers
            </div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('AnnouncementMail')}
            >
              AnnouncementMail
            </div>
            <div
              className='option-container'
              onClick={() => handleOptionClick('Report')}
            >
              Report
            </div>
          </div>
        )}
      </motion.div>
      <div className='click-container'>
        <div className='navigation-container'>
          <div style={{display:"flex"}}>
            <div
              onClick={handleImageClick}
              style={{
                width: 50,
                height: 50,
                display: 'flex',
                
                cursor: 'pointer'
              }}
            >
              <img src={logo} alt='Logo' style={{width:"2vw",height:"4vh",margin:"2vh"}} />
            </div>
            <div
              style={{
                fontSize: '25px',
                paddingTop: '1vh',
                cursor: 'pointer',
                marginLeft: '1vw'
              }}
              onClick={() => handleOptionClick('DashBoard')}
            >
              Dashboard
            </div>
          </div>
          <div style={{marginLeft:showOptions ? "61vw" : "78vw"}}>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span> Logout</span>
            </button>
          </div>
        </div>
        <div>
          {selectedOption ? (
            <div className='selected-option'>
              <GenralComponent option={selectedOption} />
            </div>
          ) : (
            <div className='default-content'>
              <h1>Welcome to the Admin Dashboard</h1>
              <p>Manage Officers and parking activities with ease!</p>
              <p>Select an option from the menu to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // return (
  // <div className={`admin-page ${menuVisible ? '' : 'collapsed'}`}>
  // <div className="menu-container">
  {
    /* <div className="logo">
          <h1>Admin Dashboard</h1>
        </div> */
  }
  {
    /* <button className="menu-toggle" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button> */
  }
  // </div>

  {
    /* <div className={`side-menu ${menuVisible ? '' : 'hidden'}`}>
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
      </div> */
  }

  {
    /* <div className="main-content">
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
            <p>Manage Officers and parking activities with ease!</p>
            <p>Select an option from the menu to get started!</p>
          </div>
        )}
      </div>
    </div> */
  }
  {
    /* ); */
  }
}

export default AdminPage
