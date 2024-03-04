import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { luser } from './Signin';
import Navbar2 from './navbar2';
import MainNavbar from './mainnavbar';
import Footer from './footer';
import './history.css'; 

const History = () => {
  const [detailsData, setDetailsData] = useState([]);
  const [expandedIndices, setExpandedIndices] = useState([]);


  
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("luser is "+ luser);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchhistory`, {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            luser,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [luser]);

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
      <MainNavbar />
      <Navbar2 />

      <div className="container mt-3">
        {/* <h3 className="text-center mb-4">Memo History for {luser}</h3> */}
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">No Plate</th>
              <th scope="col">Date</th>
              <th scope="col">Status</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {detailsData.map((obj, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{obj.pobj.no_plate}</td>
                <td>{obj.date}</td>
                <td className={obj.flag === 'true' ? 'text-success' : 'text-danger'}>
                  {obj.flag === 'true' ? 'Paid' : 'Unpaid'}
                </td>
                <td>
                  <button
                    className={`btn btn-link toggle-button ${expandedIndices.includes(index) ? 'expanded' : ''}`}
                    onClick={() => handleToggleDetails(index)}
                  >
                    {expandedIndices.includes(index) ? 'Less' : 'More'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {expandedIndices.map((index) => (
          <div key={index} className="card mt-3 custom-card">
            <div className="card-body">
              {/* Additional details for the expanded row */}
              {/* ... */}
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default History;
