import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gresult,image } from './Home';
import { luser } from './Signin';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
let mno;
const Details = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [no_plate, setNoplate] = useState(null);
  const [memonumber, setMemonumber] = useState(null);
  const [showHelloMessage, setShowHelloMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchdetails`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            gresult,
            luser,
          }),
        });

        const data = await res.json();
        setDetailsData(data);
        setNoplate(data.no_plate);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchData();
  }, [gresult]);

  const handleGenerate = async () => {
    try {
      const receiptResponse = await fetch(`${process.env.REACT_APP_API_URL}/getmemonumber`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await receiptResponse.json();
      setMemonumber(data);
      console.log(data); 
      mno=data;
    } catch (error) {
      console.error('Error processing payment:', error);
    }
    setShowHelloMessage(true);
    // console.log("mno "+mno);
    try {
      const resmemo = await fetch(`${process.env.REACT_APP_API_URL}/setmemonumber`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          no_plate,
          mno , 
        }),
      });                   
    //  console.log("complete");
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const handleSend = async () => {
    let obj = {
      no_plate: detailsData.no_plate,
    };
    console.log(obj);
    window.confirm("Are you sure?");
    console.log("called");
    const pdfContent = document.getElementById('pdf');
    const canvas = await html2canvas(pdfContent);
    const pdf = new jsPDF();

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Create a new FormData object
    const formData = new FormData();

    // Convert the data URI to a Blob and append it to the FormData
    const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    formData.append('to', detailsData.email);
    formData.append('subject', 'Vehicle Details PDF');
    formData.append('text', 'Please find the attached PDF for your vehicle details.');
    formData.append('pdfFile', pdfBlob, 'details.pdf');
    formData.append('person', obj.no_plate);
    formData.append('police', luser);
    formData.append('memo_number', mno);

    console.log("API about to call");
    const resp = await fetch(`${process.env.REACT_APP_API_URL}/sendEmail`, {
      method: "POST",
      body: formData,
    });

    const datas = await resp.json();
    window.alert(datas.message);

    // navigate('/memo', { state: { pdfDataUri: dataUri } });
  };

  return (
    <div className="container mt-5">
      {/* <h2>Welcome to the Details Page!</h2> */}
      {detailsData && (
        <div>
          <p>Name: {detailsData.name}</p>
          <p>Address: {detailsData.address}</p>
          <p>Email: {detailsData.email}</p>
          <p>No_plate: {detailsData.no_plate}</p>
          <p>Vehicle_type: {detailsData.vehicle_type}</p>
          <p>Phone no.: {detailsData.phone}</p>

          <button onClick={handleGenerate}>Generate</button>

          {showHelloMessage && (
            <div id='pdf' style={{ border: '1px solid #ccc', padding: '10px', marginTop: '10px' }}>
              <p>Date: {new Date().toString()}</p>
              <p>Memo Number: {memonumber}</p>
              <br />
              <h2>PARKING VIOLATION NOTICE</h2>
              <br />

              <p>RECIPIENT</p>
              <br />
              <p>{detailsData.name}</p>
              <p>{detailsData.phone}</p>
              <p>{detailsData.email}</p>
              <p>Dear {detailsData.name}</p>
              <br />
              <p>
                Your vehicle {detailsData.vehicle_type} with a vehicle registration number {detailsData.no_plate} has been captured by our Respected cop {detailsData.lcop}. <br />
                You can collect it from {detailsData.station}. <br />
                We do have photos and CCTV feeds that serve as proof.<br />
                We do understand that spaces are limited, so please comply with the specified rules to promote harmonious relationships with other tenants. <br />
                {image && <img src={URL.createObjectURL(image)} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />}
                If the car being referred to in this document doesn't belong to you, then please let us know immediately to avoid confusion. <br />
                Make sure to pay charges before you go to the station. <br />
                You can pay the charges for this violation by clicking the link attached below in the mail. <br /> Thank you for your understanding.
              </p>
              <h5>Ministry of Parking Violation</h5>

              <button onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Details;
