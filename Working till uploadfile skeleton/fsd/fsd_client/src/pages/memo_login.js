import React, { useState } from 'react';
import './memo_login.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';
let no_plate;

const Memo_login = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Perform authentication with the backend
      const res = await fetch('http://localhost:5000/memologin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleNumber, dob }),
      });

      const data = await res.json()

      if (res.status === 200) {
        console.log(data);
       
        sessionStorage.setItem('userToken', data.userToken);
        navigate('/memo_home');
        no_plate = vehicleNumber;
      } else {
        // Authentication failed, handle error
        const data = await res.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <div className="input-group">
        <label>Vehicle Number:</label>
        <input
          type="text"
          value={vehicleNumber}
          onChange={(e) => setVehicleNumber(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Date of Birth:</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button className="login-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

export default Memo_login;
export {no_plate};
