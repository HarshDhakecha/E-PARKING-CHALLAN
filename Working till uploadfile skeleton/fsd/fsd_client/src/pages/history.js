import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { luser } from './Signin';
import './history.css'; 

const History = () => {
  const [detailsData, setDetailsData] = useState([]);
  const [expandedIndices, setExpandedIndices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("luser is "+ luser);
        const res = await fetch('http://localhost:5000/fetchhistory', {
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
    <div className="container mt-3">
      <h3 className="text-center mb-4">Hello {luser}, here is your history</h3>

      {detailsData.map((obj, index) => (
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
  );
};

export default History;
