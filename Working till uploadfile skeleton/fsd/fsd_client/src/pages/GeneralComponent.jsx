import React, { useState, useEffect, useRef } from "react";
import "./generalComponent.css";
import GenralComponent2 from "./GeneralComponent2";
import ClipLoader from "react-spinners/ClipLoader";
import { jwtDecode } from 'jwt-decode';
import { css } from "@emotion/react";
import { uname } from "./Signin";

const GenralComponent = (option) => {

  const [detailsData, setDetailsData] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [username, setUsername] = useState(null);
  const [searchUsername, setSearchUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDetailsData, setshowDetailsData] = useState(false);
  const [expandedIndices, setExpandedIndices] = useState([]);

  const [addOfficerForm, setAddOfficerForm] = useState({
    name: "",
    password: "",
    username: "",
    email: "",
    
  });
  const [selectedOption, setSelectedOption] = useState("single");
  const [showAddOfficerForm, setShowAddOfficerForm] = useState(false);

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
      if (searchUsername === "") {
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
              searchUsername, uname
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
      fetchOfficerDataToPrint();
    } catch (error) {
      console.error("Error removing officer:", error);
    }
  };

  const handleRemoveAllOfficer = async () => {
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

  const handleAddOfficer = () => {
    setShowAddOfficerForm(true);
  };

  const handleAddSingleOfficer = async () => {
    console.log("enter");
    const response = await fetch(
      'http://localhost:5000/addsingleofficer',
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addOfficerForm,
        }),
      }
    );

    const data = await response.json();
    window.alert(data.message);
    setShowAddOfficerForm(false);
    fetchOfficerDataToPrint();
  };

  const handleHistoryClick = async (luser) => {
    console.log("officerusername "+luser);
    const response = await fetch(
      'http://localhost:5000/fetchhistory',
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          luser,
        }),
      }
    );

    const data = await response.json();
    setDetailsData(data);
    setshowDetailsData(!showDetailsData);
    // setShowAddOfficerForm(false);
    // fetchOfficerDataToPrint();
  };

  const handleToggleDetails = (index) => {
    setExpandedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        // Remove index if already expanded
        return prevIndices.filter((i) => i !== index);
      } else {
        // Add index if not expanded
        return [...prevIndices, index];
      }
    });
  };

  return (
    <div>
      <h2>{option.option}</h2>
      {loading && (
        <div className="loading-overlay">
          <ClipLoader color="#3498db" loading={loading} size={50} />
        </div>
      )}
      <div className="search-bar">
        <input
          type="text"
          value={searchUsername}
          onChange={(e) => setSearchUsername(e.target.value)}
          placeholder="Search by username"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {showAddOfficerForm && (
        <div>
          <h3>Add Single Officer</h3>
          <form>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={addOfficerForm.name}
              onChange={handleInputChange}
            />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={addOfficerForm.password}
              onChange={handleInputChange}
            />
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={addOfficerForm.username}
              onChange={handleInputChange}
            />
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={addOfficerForm.email}
              onChange={handleInputChange}
            />
            
            <button type="button" onClick={handleAddSingleOfficer}>
              Add Officer
            </button>
          </form>
        </div>
      )}
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
              <button
                onClick={() => handleRemoveOfficer(officer.username)}
                className="remove-button"
              >
                Remove
              </button>
            </div>
            {officer.showDetails && (
              <div className="student-details">
                <div>Officer Name: {officer.name}</div>
                <div>Username: {officer.username}</div>
                <div>Password: {officer.password}</div>
                <div>Email: {officer.email}</div>
                <button onClick={() => handleHistoryClick(officer.username)}> {showDetailsData && officer.showDetails ? "Hide History" : "Show History"}</button>


                {showDetailsData && detailsData.map((obj, index) => (
        <div key={index} className="card mt-3 custom-card">
          <div className="status-circle-wrapper">
            <div className={`status-circle ${obj.flag === 'true' ? 'green' : 'red'}`}></div>
          </div>
          <div className="card-body">
            <p className="card-text"><strong>No Plate:</strong> {obj.pobj.no_plate}</p>
            <p className="card-text"><strong>Status:</strong> {obj.flag === 'true' ? 'Paid' : 'Unpaid'}</p>
            
            {expandedIndices.includes(index) && (
              <>
                <p className="card-text"><strong>Memo-Number:</strong> {obj.memo_number}</p>
                <p className="card-text"><strong>Name:</strong> {obj.pobj.name}</p>
                <p className="card-text"><strong>Address:</strong> {obj.pobj.address}</p>
                <p className="card-text"><strong>Vehicle Type:</strong> {obj.pobj.vehicle_type}</p>
                <p className="card-text"><strong>MemoDate:</strong> {obj.date}</p>
                {obj.flag === 'true' && (
                  <>
                    <p className="card-text"><strong>Pay Date:</strong> {obj.status}</p>
                  </>
                )}
              </>
            )}

            <button
              className="btn btn-link"
              onClick={() => handleToggleDetails(index)}
            >
              {expandedIndices.includes(index) ? 'Less' : 'More'}
            </button>
          </div>
        </div>
      ))}
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
      <button onClick={handleAddOfficer}>Add Officer</button>
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
      {option.option === "AnnouncementMail" && (
        <GenralComponent2 option={(option = option.option)} />
      )}
    </div>
  );
};

export default GenralComponent;
