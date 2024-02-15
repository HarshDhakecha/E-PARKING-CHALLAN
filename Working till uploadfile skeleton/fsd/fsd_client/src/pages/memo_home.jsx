import React, { useState, useEffect } from 'react';
import './memo_home.css';
import { Link, useNavigate } from 'react-router-dom';
import { no_plate } from './memo_login';
import Navbar from './navbar';

let name;
let mdate, pdate, tno, rno,mno;

const Memo_home = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [showReceiptDetails, setShowReceiptDetails] = useState(false);
  const [paymentData, setPaymentData] = useState();
  const [receipt, setReceipt] = useState(null);
  const [data, setdata] = useState(null);
  const [rn, setRn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res2 = await fetch("http://localhost:5000/getflag", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            no_plate,
          }),
        });
        console.log("insert");
        const data3 = await res2.json();
        setdata(data3);
        mno=data3.mno;
        // console.log(data3);
      } catch (error) {
        console.error('Error fetching status:', error);
      }

      try {
        const res = await fetch("http://localhost:5000/fetchmemodetails", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            no_plate,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
        name = data.name;
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [no_plate]);

  const handlePay = async () => {
    try {
      // Fetch receipt
      const receiptResponse = await fetch("http://localhost:5000/getreceipt", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const receiptData = await receiptResponse.json();
      setReceipt(receiptData);
  
      // Generate random number
      const randomNum = Math.floor(Math.random() * 90000) + 10000;
      setRn(randomNum);
      rno= randomNum;
      // Use the updated receipt state in the subsequent logic
      tno = receiptData;
  
      // Update MongoDB with payment details
      const updateHistoryResponse = await fetch("http://localhost:5000/changehistory", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          no_plate,
          rno: randomNum, // Use the updated randomNum directly
          tno,
        }),
      });
      const updatedHistoryData = await updateHistoryResponse.json();
  
      // Update paymentData state
      setPaymentData(updatedHistoryData);
      mdate = updatedHistoryData.memodate;
      pdate = updatedHistoryData.paydate;
  
      // Navigate to the receipt page after processing the payment
      navigate('/receipt');
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  const handleShowReceipt = () => {
    setShowReceiptDetails(true);
  };
  
  const renderDetails = () => {
    if (data && data.flag === "false" && detailsData) {
      return (
        <div className="details-info">
          <p>Memo Number: {data.mno}</p>
          <p><strong>Name:</strong> {detailsData.name}</p>
          <p><strong>Address:</strong> {detailsData.address}</p>
          <p><strong>Number Plate:</strong> {detailsData.no_plate}</p>
          <p><strong>Vehicle Type:</strong> {detailsData.vehicle_type}</p>
          <p>Pay the below Charges</p>
          <button className='pay-button' onClick={handlePay}>Pay</button>
         
        </div>
      );
    }else{
      return (
        <p><strong>No Pending Memo</strong></p>
      );
    }
    return null;
  };

  return (
    <div>
    <Navbar/>
      <Link className="navbar-brand history-link" to="/personhistory">
      History
    </Link>
      <div className="details-container">
        {renderDetails()}
    </div>
                            
    
  </div>
  );
};


export default Memo_home;
export { name, mdate, pdate,tno,rno,mno };
