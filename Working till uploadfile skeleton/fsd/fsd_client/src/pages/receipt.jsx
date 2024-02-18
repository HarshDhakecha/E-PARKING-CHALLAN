import React, { useState, useEffect, useRef } from 'react';
import { name } from './memo_home';
import { no_plate } from './memo_login';
import './receipt.css'; // Import your CSS file
import { jsPDF } from 'jspdf';
import { mdate, pdate,tno,rno,mno } from './memo_home';


const Receipt = () => {
  const [detailsData, setDetailsData] = useState(null);
  const [address, setaddress] = useState(null);
  const [phone, setphone] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  // const [rn, setrn] = useState(null);

  const receiptContainerRef = useRef(null);

  useEffect(() => {
    console.log("insert into effect");
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/getreceipt`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await res.json();
        console.log(data);
        setReceipt(data);
        tno=receipt;
      } catch (error) {
        console.error('Error fetching details:', error);
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetchmemodetails`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({
            no_plate,
          }),
        });

        const data = await res.json();
        console.log(data);
        setDetailsData(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }

    };

    fetchData();
  }, []);

  const handleDownload = async () => {

    // try {
    //   const res = await fetch("${process.env.REACT_APP_API_URL}/changehistory", {
    //     method: "POST",
    //     headers: { "Content-type": "application/json" },
    //     body: JSON.stringify({
    //       no_plate,
    //     }),
        
    //   });
    //   const data2 = await res.json();
      
    // } catch (error) {
    //   console.error('Error fetching details:', error);
    // }


    // function inchesToPoints(inches) {
    //   // 1 inch = 72 points
    //   return inches * 72;
    // }
    // try {
    //   // Capture HTML content as an image using html2canvas
    //   const canvas = await html2canvas(receiptContainerRef.current);
  
    //   // Convert the image to a PDF using jspdf
    //   const imgData = canvas.toDataURL('image/png');
      
    //   // Specify the default width and height in inches
    //   let pdfWidthInches = 8.5;  // default for letter size paper
    //   let pdfHeightInches = 11;  // default for letter size paper
  
    //   // Adjust dimensions based on screen size
    //   const screenWidth = window.innerWidth;
    //   if (screenWidth <= 600) {
    //     // For small screens, you might want different dimensions
    //     pdfWidthInches = 4.25;
    //     pdfHeightInches = 5.5;
    //   }
  
    //   // Convert inches to points
    //   const pdfWidthPoints = inchesToPoints(pdfWidthInches);
    //   const pdfHeightPoints = inchesToPoints(pdfHeightInches);
  
    //   // Create a PDF with the correct size based on the captured content
    //   const pdf = new jsPDF({
    //     unit: 'pt',
    //     format: [pdfWidthPoints, pdfHeightPoints],
    //   });
  
    //   pdf.addImage(imgData, 'PNG', 0, 0, pdfWidthPoints, pdfHeightPoints);
    //   pdf.save('receipt.pdf');
    // } catch (error) {
    //   console.error('Error generating PDF:', error);
    // }



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
    doc.text(`Receipt Id: ${rno}`, 20, 90);
    doc.text(`Memo-Number: ${mno}`, 20, 100);
    doc.text(`Memo_Date: ${mdate}`, 20, 110);

    // Payment Details
    doc.setFont('times', 'bold');
    doc.setFontSize(16);

    doc.text('Payment Details', doc.internal.pageSize.width / 2, 130, { align: 'center' });
    doc.setFont('times', 'normal');
    doc.setFontSize(14);

    doc.text(`From: ${detailsData.name}`, 20, 140);
    doc.text(`Address: ${detailsData.address}`, 20, 150);
    doc.text(`Payment received from ${detailsData.name} of amount 2000Rs. for parking violation`, 20, 160, { maxWidth: doc.internal.pageSize.width - 40 });
    doc.text(`Payment-Date: ${pdate}`, 20, 180);
    doc.text(`Transaction_No: ${tno}`, 20, 190);

    // Save the PDF
    doc.save('payment_receipt.pdf');



  };
  return (
    <div>
      <div className="receipt-container" ref={receiptContainerRef}>
        <h3>Payment Receipt</h3>
        <h5>Ministry of No Parking Violation</h5>
        <p>Address Line Here</p>
        <p>Phone: 555-555-55555</p>
        <p>Fax: 123-123-123456</p>
        <p>Email: abc@gmail.com</p>
        <p>Receipt Id: {rno}</p>
        <p>Memo-Number: {mno}</p>
        <p>MemoDate: {mdate}</p>

        <h5>Payment Details</h5>
        <p>From: {name}</p>
        <p>Address: {detailsData.address}</p>
        <p>Payment received from {name} of amount 2000Rs. for parking violation</p>
        <p>Paymentdate: {pdate}</p>
         <p>Transaction No: {tno}</p>
      </div>

      <div className="button-container">
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
};

export default Receipt;
