import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import "bootstrap/dist/css/bootstrap.min.css";
let uname;

let luser;
export default function Signin() {
    
    let navigate = useNavigate();
    const location = useLocation();
    const [registrationSuccessMessage, setRegistrationSuccessMessage] =
      useState(null);
    const [user, setUser] = useState({
      username: "",
      password: "",
    });
  
    useEffect(() => {
      if (location.state && location.state.registrationSuccess) {
        setRegistrationSuccessMessage("Registration successful! Please wait until you are verified by higher authority");
  
        const timeoutId = setTimeout(() => {
          setRegistrationSuccessMessage(null);
        }, 5000);
  
        return () => clearTimeout(timeoutId);
      }
    }, [location.state]);
  
    let name, value;
  
    const handleInputs = (e) => {
      name = e.target.name;
      value = e.target.value;
  
      setUser({ ...user, [name]: value });
    };
  
    const PostData = async (e) => {
      e.preventDefault();
  
      const { username, password } = user;
  
      if (!username || !password) {
        window.alert("Please fill all the fields properly");
        navigate("/login");
      } else {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            username,
            password,
          }),
        });
  
        const data = await res.json()
  
         if (res.status === 200) {
          console.log(data);

          // window.alert("Login Successful!");
          // console.log(data)
          luser=username;
          // console.log("before");
          sessionStorage.setItem('officerToken', data.officerToken);
          // console.log("after");

          navigate("/officerhome");
        }  if (res.status === 202) {
          // window.alert("Admin login Successful!");
          uname=username; 
          // console.log("Admin Username "+uname);
          sessionStorage.setItem("adminToken", data.adminToken);
          navigate("/adminhome");
        } if (res.status == 201) {
          console.log(res.msg);
          sessionStorage.setItem("mainadminToken", data.adminToken);

        
          navigate("/mainadminhome");
        }
         if (res.status == 401) {
          console.log("400001");
          console.log(data);

          window.alert("Incorrect username or password");
          navigate("/login");
        }

      }
      
    };
    
  
    return (
      <>
        <div className='container-fluid ' style={{ minHeight: "100vh" }}>
          <div className="container-fluid registration-container">
            <div className="row justify-content-center">
              <div className="col-md-6 mt-25">
                <div className="registration-form">
                  <h2 className="text-center mb-4">Log In</h2>
                  <div className="row justify-content-center">
  
                    <form method="post" className="mx-1 mx-md-4" onSubmit={PostData}>
                      {registrationSuccessMessage && (
                        <div className="alert alert-success" role="alert">
                          {registrationSuccessMessage}
                        </div>
                      )}
  
                      <div className="d-flex flex-row align-items-center mb-4">
                        <div className="d-flex justify-content-center form-outline flex-fill mb-0">
  
                          {/* <FaUser /> */}
                          <input
                            type="text"
                            id="username"
                            className="form-control"
                            name="username"
                            placeholder="Username"
                            value={user.username}
                            onChange={handleInputs}
                            style={{ width: "70%" }}
                          />
  
                        </div>
                      </div>
  
                      <div className="d-flex flex-row align-items-center mb-4">
                        {/* <FaLock /> */}
                        <div className="d-flex justify-content-center form-outline flex-fill mb-0">
                          <input
                          
                            type="password"
                            id="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={user.password}
                            onChange={handleInputs}
                            style={{ width: "70%" }}
                          />
  
                        </div>
                      </div>
  
                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="submit"
                          className="btn btn-clr btn-primary btn-lg"
  
                        >
                          LogIn
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </>
  );
}
//<p className="text-center text-muted mt-5 mb-0">Not Registered Yet?? <Link to="/register" className="fw-bold text-body"><u>Register here</u></Link></p>
export {luser,uname};