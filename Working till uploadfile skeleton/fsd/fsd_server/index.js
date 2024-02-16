const mongoose = require('mongoose');
const express = require('express');
const app = express();
const portnumber = 5000;
const cors = require('cors');
const url = 'mongodb+srv://omoslaniya92:mongodb5176@om.byczp8k.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });

app.use(cors());


app.listen(portnumber, () => {
    console.log("Application started on port number " + portnumber);
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.json());


app.use('/', require("../fsd_server/Routes/Login"))
app.use('/', require("../fsd_server/Routes/fetch_pdetails"))
app.use('/', require("../fsd_server/Routes/send_mail"))
app.use('/', require("../fsd_server/Routes/memo_login_server"))
app.use('/', require("../fsd_server/Routes/fetch_memo_pdetails"))
app.use('/', require("../fsd_server/Routes/generateReceipt"))
app.use('/', require("../fsd_server/Routes/fetch_history"))
app.use('/', require("../fsd_server/Routes/change_history"))
app.use('/', require("../fsd_server/Routes/getflag"))
app.use('/', require("../fsd_server/Routes/fetchpersonhistory"))
app.use('/', require("../fsd_server/Routes/download"))
app.use('/', require("../fsd_server/Routes/memo_number"))
app.use('/', require("../fsd_server/Routes/setmemonumber"))
app.use('/', require("../fsd_server/Routes/removeOfficer"))
app.use('/', require("../fsd_server/Routes/viewOfficerdata"))
app.use('/', require("../fsd_server/Routes/addSingleOfficer"))