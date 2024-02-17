// App.js
import * as React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Signin from "../src/pages/Signin";
import Details from "../src/pages/details";
import Memo from "./pages/memo";
import Signup from "../src/pages/Signup";
import OfficerHome from "./pages/Home";
import PrivateRouteOfficer from "./PrivateRouteOfficer";
import PrivateRouteAdmin from "./PrivateRouteAdmin";
import PrivateRouteMainAdmin from "./PrivateRouteMainAdmin";
import Memo_login from "./pages/memo_login";
import Memo_home from "./pages/memo_home";
import Receipt from "./pages/receipt";
import History from "./pages/history";
import Personhistory from "./pages/personhistory";
import AdminPage from "./pages/AdminPage";
import MainAdminPage from "./pages/mainAdmin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/officerhome" element={<PrivateRouteOfficer element={<OfficerHome />} />} />
        <Route path="/details" element={<Details />} />
        <Route path="/memo" element={<Memo />} />
        <Route path="/memo_login" element={<Memo_login />} />
        <Route path="/memo_home" element={<Memo_home />} />
        <Route path="/receipt" element={<Receipt />} />
        <Route path="/history" element={<History />} />
        <Route path="/personhistory" element={<Personhistory />} />
        <Route path="/memo" element={<Memo />} />
        <Route path="/adminhome" element={<PrivateRouteAdmin element={<AdminPage />} />} />
        <Route path="/mainadminhome" element={<PrivateRouteMainAdmin element={<MainAdminPage />} />}/>
       
        <Route path="*" element={<Signin />} />
      </Routes>
    </Router>
  );
}

export default App;
