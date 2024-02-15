import React, { useState, useEffect, useRef } from "react";
import "./generalComponent.css";
import GenralComponent2 from "./GeneralComponent2";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from 'jwt-decode';
import { css } from "@emotion/react";
import { uname } from "./Signin";

const GenralComponent = (option) => {
  
  const [officers, setOfficers] = useState([]);
  const [username, setUsername] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [addOfficerForm, setAddOfficerForm] = useState({
    name: "",
    password: "",
    username: "",
    email: "",
    mobile_no: "",
  });
  const [selectedOption, setSelectedOption] = useState("single");
  const [showAddOfficerOptions, setShowAddOfficerOptions] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddOfficerForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };


  useEffect(() => {
    const token = sessionStorage.getItem('adminToken'); 
    if (token) {
      const decodedToken = jwtDecode(token);
      const { username } = decodedToken.user;
      setUsername(username);
    }
  }, []);


  useEffect(() => {
    handleSearch();
  }, [searchUsername]);

  const handleSearch = async () => {
    try {
      console.log("entered");
      console.log(searchUsername);
      // setLoading(true);
      if (searchUsername === "") {
        // If the search bar is empty, clear the displayed officers
        setOfficers([]);
      } else {
        const response = await fetch(
          `http://localhost:5000/searchofficer`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              searchUsername,uname
            }),
          }
        );
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setOfficers(data);
        } else {
          setOfficers([]);
        }
      }
    } catch (error) {
      console.error("Error searching officers:", error);
    } finally {
      // setLoading(false);
    }
  };
    
  

  const handleRemoveOfficer = async (studentid) => {
    try {
      const response = await fetch(
        `http://localhost:5000/removeofficer/${studentid}`,
        {
          method: "post",
        }
      );

      const data = await response.json();
      window.alert(data.message);
      // Refresh officer data after removal
      fetchOfficerDataToPrint();
    } catch (error) {
      console.error("Error removing officer:", error);
    }
  };

  const handleRemoveAllOfficer = async () => {
    console.log("uname is "+uname);
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete all officer data?"
      );
      if (confirmed) {
        const response = await fetch(
          `http://localhost:5000/removeallofficer`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              uname,
            }),
          }
          
        );

        const data = await response.json();
        window.alert(data.message);
        // Refresh officer data after removal
        fetchOfficerDataToPrint();
      }
    } catch (error) {
      console.error("Error removing all officers:", error);
    }
  };

  const fetchOfficerDataToPrint = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/officerdataadmin`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
          }),
        }
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setOfficers(data);
      } else {
        setOfficers([]);
      }
    } catch (error) {
      console.error("Error fetching officers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOfficer = async () => {
    setShowAddOfficerOptions(true);
  };

  const handleAddSingleOfficer = async () => {
    // Add logic for adding a single officer
    // ...
    setShowAddOfficerOptions(false);
    fetchOfficerDataToPrint();
  };

  const handleAddMultipleOfficers = async () => {
    // Add logic for adding multiple officers
    // ...
    setShowAddOfficerOptions(false);
    fetchOfficerDataToPrint();
  };


  return (
    <div>
      {option.option === "ManageOfficers" && (
        <>
          <h2>{option.option}</h2>
          {loading && (
            <div className="loading-overlay">
              <ClipLoader color="#3498db" loading={loading} size={50} />
            </div>
          )}
          {/* Search bar - live search */}
          <div className="search-bar">
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              placeholder="Search by username"
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          {/* Display officers */}
          {officers.length === 0 ? (
            <p>No officer found.</p>
          ) : (
            officers.map((officer, index) => (
              <div key={officer.username} className="student-container">
                <div className="student-header">
                  <button
                    onClick={() =>
                      setOfficers((prevOfficers) =>
                        prevOfficers.map((s) =>
                          s.username === officer.username
                            ? { ...s, showDetails: !s.showDetails }
                            : s
                        )
                      )
                    }
                  >
                    {officer.showDetails ? "-" : "+"}
                  </button>
                  <div>
                    {index + 1}. {officer.username}
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveOfficer(officer.username)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
                {/* Check if details should be displayed */}
                {officer.showDetails && (
                  <div className="student-details">
                    <div>Officer Name: {officer.name}</div>
                    <div>Password: {officer.password}</div>
                    <div>Email: {officer.email}</div>
                    <div>Mobile No: {officer.mobile_no}</div>
                  </div>
                )}
              </div>
            ))
          )}
          <div>
            <button
              style={{
                backgroundColor: "#ff4d4d",
                color: "white",
                padding: "8px 16px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              onClick={handleRemoveAllOfficer}
            >
              Remove All
            </button>
          </div>
          {showAddOfficerOptions ? (
            <>
              <button onClick={handleAddSingleOfficer}>Add Single Officer</button>
              <button onClick={handleAddMultipleOfficers}>
                Add Multiple Officers
              </button>
            </>
          ) : (
            <button onClick={handleAddOfficer}>Add Officer</button>
          )}
          <button
            style={{
              backgroundColor: "#3498db",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={fetchOfficerDataToPrint}
          >
            Show Officers
          </button>
        </>
      )}
      {option.option === "AnnouncementMail" && (
        <>
          <GenralComponent2 option={(option = option.option)} />
        </>
      )}
    </div>
  );
};

export default GenralComponent;
