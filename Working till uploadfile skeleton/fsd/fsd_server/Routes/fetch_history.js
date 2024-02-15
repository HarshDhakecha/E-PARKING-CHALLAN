const express = require('express');
const bodyParser = require('body-parser');
const router = require('./Login');
const cors = require('cors')
const personSchema = require('../models/pdetails');
const mongoose = require('mongoose');
const Person = mongoose.model("person_detail", personSchema);
const authoritySchema = require("../models/authoritySchema");
const Professor = mongoose.model("authority", authoritySchema);
const memohistory = require("../models/memo_history");



const app = express();
const port = 5000;
app.use(bodyParser.json());
app.use(cors());

router.post('/fetchhistory', async(req, res) => {
    try {

        let details = [];
        console.log("wwwwwwww");
        const { luser } = req.body;
        console.log(luser);
        // console.log("welcome");
        const p = await Professor.findOne({ username: luser });
        // console.log(p);
        const police_id = p._id;
        // console.log(police_id);
        const police1 = await memohistory.find({ authority: police_id });
        // console.log(police1);
        // console.log(police1);
        for (let police of police1) {
            let pid = police.person;
            let date = police.memodate;
            let status = police.paydate;
            let flag = police.flag;
            let memo_number = police.memo_number;
            // console.log(memo_number);
            const pdetail = await Person.findOne({ _id: pid });

            let obj = {
                pobj: pdetail,
                date: date,
                status: status,
                flag: flag,
                memo_number: memo_number,
            }
            details.push(obj);

        }
        // console.log(details);


        // const personIds = police1.map(entry => entry.person);
        // const dates = police1.map(entry => entry.memodate);
        // // console.log(personIds);


        // const persons = await Person.find({ _id: { $in: personIds } });
        // console.log(persons);
        // console.log(dates);

        // console.log(result.persons_data);
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;