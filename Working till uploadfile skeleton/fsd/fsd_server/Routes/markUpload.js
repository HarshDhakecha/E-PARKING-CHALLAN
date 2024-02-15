const markS1Schema = require("../models/markS1Schema");
const multer = require('multer');
const { Readable } = require('stream');
const csvParser = require('csv-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = 'THISISMYSECURITYKEYWHICHICANTGIVEYOU';
const storage = multer.memoryStorage();
const upload = multer({ storage });



router.post('/upload-endpoint', upload.single('file'), async (req, res) => {

    const uploadedFile = req.file;
    const { department, year, subject, sessional } = req.body;
    
    console.log(department, year,subject,sessional);
    console.log('File received:', uploadedFile);
    const CsvModel = mongoose.model(department+year+subject+sessional, markS1Schema);

    try {
        const csvObjects = await parseCSVFromBuffer(uploadedFile.buffer);

        // Log the CSV objects to the terminal
        console.log('CSV Objects:', csvObjects);

        // Insert data into MongoDB
        await CsvModel.create(csvObjects);

        res.json({
            message: 'CSV data uploaded successfully',
            content: csvObjects,
        });
    } catch (error) {
        console.error('Error saving file to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const parseCSVFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const results = [];

        const stream = bufferToStream(buffer);
        stream.pipe(csvParser({ separator: ';' })) // Specify the delimiter used in your CSV file
            .on('data', (data) => {
                const csvObject = {
                    Id: data.Id,
                    CO1: data.CO1,
                    CO2: data.CO2,
                    CO3: data.CO3,
                    CO4: data.CO4,
                    CO5: data.CO5,
                    CO6: data.CO6,
                };
                results.push(csvObject);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const bufferToStream = (buffer) => {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
};

module.exports = router;



/*
        Retrive Data
const mongoose = require('mongoose');
const CsvModel = mongoose.model('next122345000');

// Example: Retrieve all documents
CsvModel.find({}, (err, documents) => {
    if (err) {
        console.error('Error retrieving documents:', err);
    } else {
        console.log('Retrieved documents:', documents);
    }
});
 */