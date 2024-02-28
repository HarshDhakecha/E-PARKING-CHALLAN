import { Link, useNavigate } from 'react-router-dom';
import React, { useState ,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { luser } from './Signin';
import Loader from './Loader';
import Navbar2 from './navbar2';
import { jwtDecode } from "jwt-decode";


let gresult;
let image;

const OfficerHome = () => {
  const [file, setFile] = useState();
  const [uploaded, setUploaded] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setUploaded(false);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("officerToken"); // Retrieve the token from where you store it
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

  const handleUpload = () => {
    // <Loader/>
    const formData = new FormData();
    formData.append('image', file);
   // formData.append('luser',luser);

    fetch(`${process.env.REACT_APP_PYTHON_URL}/api/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*',
        
      },
    })
      .then(response => response.json())
      .then(data => {
        const resultString = data.message.join('');
        gresult=resultString;
        image = file;
        console.log(resultString);
        setUploaded(true);
       
        
        navigate('/details');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <Navbar2/>
    <div className="container mt-5">
          
      <div className="mt-3">
       
        <div className="App">
         

          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload}>Upload</button>
          
          {uploaded && (
            <Link to="/details">
              <button>Get Details</button>
            </Link>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default OfficerHome;
export {gresult,image};
