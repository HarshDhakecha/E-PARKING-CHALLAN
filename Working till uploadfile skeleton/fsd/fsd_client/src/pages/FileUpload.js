import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSessional, setSelectedSessional] = useState('');

  const subjects = {
    IT: {
      '2021': ['DBMS', 'DAA'],
      '2022': ['DDC', 'CCN'],
      '2023': ['IT Subject1', 'IT Subject2'],
      '2024': ['IT Subject3', 'IT Subject4'],
    },
    CE: {
      '2021': ['CE Subject1', 'CE Subject2'],
      '2022': ['CE Subject3', 'CE Subject4'],
      '2023': ['CE Subject5', 'CE Subject6'],
      '2024': ['CE Subject7', 'CE Subject8'],
    },
  };

  const handleDepartmentChange = (event) => {
    const department = event.target.value;
    setSelectedDepartment(department);
    setSelectedYear('');
    setSelectedSubject('');
    setSelectedSessional('');
  };

  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);
    setSelectedSubject('');
    setSelectedSessional('');
  };

  const handleSubjectChange = (event) => {
    const subject = event.target.value;
    setSelectedSubject(subject);
  };

  const handleSessionalChange = (event) => {
    const sessional = event.target.value;
    setSelectedSessional(sessional);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile && selectedDepartment && selectedYear && selectedSubject && selectedSessional) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('department', selectedDepartment);
      formData.append('year', selectedYear);
      formData.append('subject', selectedSubject);
      formData.append('sessional', selectedSessional);

      fetch('http://localhost:5000/upload-endpoint', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log('File uploaded successfully:', data);
          window.alert('Data Uploaded');
          // You can handle the server response here
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.log('Please fill in all the dropdowns and choose a file.');
    }
  };

  const isUploadSectionVisible =
    selectedDepartment !== '' &&
    selectedYear !== '' &&
    selectedSubject !== '' &&
    selectedSessional !== '';

  return (
    <div className="file-upload-container">
      <h1>File Upload Page</h1>
      <div>
        <label>Department:</label>
        <select value={selectedDepartment} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="CE">CE</option>
        </select>
      </div>

      {selectedDepartment && (
        <div>
          <label>Year:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="">Select Year</option>
            {Object.keys(subjects[selectedDepartment]).map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedYear && (
        <div>
          <label>Subject:</label>
          <select value={selectedSubject} onChange={handleSubjectChange}>
            <option value="">Select Subject</option>
            {subjects[selectedDepartment][selectedYear].map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubject && (
        <div>
          <label>Sessional:</label>
          <select value={selectedSessional} onChange={handleSessionalChange}>
            <option value="">Select Sessional</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      )}

      {isUploadSectionVisible && (
        <div>
          <label className="file-input-label">
            <input type="file" onChange={handleFileChange} />
            Choose File
          </label>
          <button className="upload-button" onClick={handleUpload}>
            Upload
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
