const express = require('express');
const multer = require('multer');
const exceljs = require('exceljs');
const stream = require('stream');
const router = express.Router();
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const stationadmin = require("../models/station_admin");


router.post('/viewofficer/:id', async(req, res) => {
    try {
        const officerName = req.params.id;
        const officer = await stationadmin.findOne({ username: studentUserName });
        if (!student) {
            return res.json({ message: "Unable to find student" });
        }


        return res.json({
            details: student,
            message: 'Student  Data Found.',
        });
    } catch (error) {
        console.error('Unable to Find Student at the moment', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;