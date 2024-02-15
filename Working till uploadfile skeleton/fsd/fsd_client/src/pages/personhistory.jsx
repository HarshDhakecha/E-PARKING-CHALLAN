import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { no_plate } from './memo_login';
import './personhistory.css';
import { jsPDF } from 'jspdf';
import Navbar from './navbar';

const Personhistory = () => {
  const [detailspData, setDetailspData] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [expandedIndices, setExpandedIndices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        // console.log("person history");


        try {
            const res = await fetch("http://localhost:5000/fetchmemodetails", {
              method: "POST",
              headers: { "Content-type": "application/json" },
              body: JSON.stringify({
                no_plate,
              }),
            });
    
            const data = await res.json();
            setDetailspData(data); 
            
          } catch (error) {
            console.error('Error fetching details:', error);
          }


      try {
        
        const res = await fetch('http://localhost:5000/fetchpersonhistory', {
          method: 'POST',
          headers: { 'Content-type': 'application/json' },
          body: JSON.stringify({
            no_plate,        
          }),
        });

        const data = await res.json();
        setDetailsData(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [no_plate]);

const handleToggleDetails = (index) => {
    setExpandedIndices((prevIndices) => {
      if (prevIndices.includes(index)) {
        
        return prevIndices.filter((i) => i !== index);
      } else {
       
        return [...prevIndices, index];
      }
    });
  };
const handleDownloadReceipt = (obj) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    });

    // Add border
    doc.setDrawColor(44, 62, 80);
    doc.rect(5, 5, doc.internal.pageSize.width - 10, doc.internal.pageSize.height - 10);

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text('Payment Receipt', doc.internal.pageSize.width / 2, 20, { align: 'center' });

    // Ministry Details
    doc.setFont('times', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    doc.text('Ministry of No Parking Violation', doc.internal.pageSize.width / 2, 30, { align: 'center' });
    doc.text('Address Line Here', doc.internal.pageSize.width / 2, 40, { align: 'center' });
    doc.text('Phone: 555-555-55555', doc.internal.pageSize.width / 2, 50, { align: 'center' });
    doc.text('Fax: 123-123-123456', doc.internal.pageSize.width / 2, 60, { align: 'center' });
    doc.text('Email: abc@gmail.com', doc.internal.pageSize.width / 2, 70, { align: 'center' });

    // Receipt Details
    doc.setFont('times', 'normal');
    doc.text(`Receipt Id: ${obj.rno}`, 20, 90);
    doc.text(`Memo-Number: ${obj.mno}`, 20, 100);
    doc.text(`Memo_Date: ${obj.date}`, 20, 110);

    // Payment Details
    doc.setFont('times', 'bold');
    doc.setFontSize(16);

    doc.text('Payment Details', doc.internal.pageSize.width / 2, 130, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(14);

    doc.text(`From: ${detailspData.name}`, 20, 140);
    doc.text(`Address: ${detailspData.address}`, 20, 150);
    doc.text(`Payment received from ${detailspData.name} of amount 2000Rs. for parking violation`, 20, 160, { maxWidth: doc.internal.pageSize.width - 40 });
    doc.text(`Payment-Date: ${obj.status}`, 20, 180);
    doc.text(`Transaction_No: ${obj.tno}`, 20, 190);

    // Save the PDF
    doc.save('payment_receipt.pdf');
  };

  return (
    <div>
      <Navbar/>
    
    <div className="container mt-3">
      
      <h3 className="text-center mb-4">Hello {detailspData.name}, here is your history</h3>

      {detailsData.map((obj, index) => (
       
        <div key={index} className="card mt-3 custom-card">
          <div className="status-circle-wrapper">
            <div className={`status-circle ${obj.flag === 'true' ? 'green' : 'red'}`}></div>
          </div>
          <div className="card-body">
            <p className="card-text"><strong>Status:</strong> {obj.flag === 'true' ? 'Paid' : 'Unpaid'}</p>

            {expandedIndices.includes(index) ? (
              <>
                <p className="card-text"><strong>Officer Name:</strong> {obj.pobj.name}</p>
                <p className="card-text"><strong>Station:</strong> {obj.pobj.station}</p>
                <p className="card-text"><strong>Vehicle Type:</strong> {detailspData.vehicle_type}</p>
                <p className="card-text"><strong>Number Plate:</strong> {detailspData.no_plate}</p>
                <p className="card-text"><strong>MemoDate:</strong> {obj.date}</p>
                {obj.flag === 'true' && (
                  <>
                    <p className="card-text"><strong>PayDate:</strong> {obj.status}</p>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="card-text"><strong>Number Plate:</strong> {detailspData.no_plate}</p>
                {/* <p className="card-text"><strong>MemoDate:</strong> {obj.date}</p> */}
              </>
            )}
            {obj.flag === 'true' && (
              <div className="text-center mt-3">
                <button
                  className="btn btn-primary download-button"
                  onClick={() => handleDownloadReceipt(obj)}
                >
                  Download Receipt
                </button>
              </div>
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
    </div>
  );
};

export default Personhistory;
