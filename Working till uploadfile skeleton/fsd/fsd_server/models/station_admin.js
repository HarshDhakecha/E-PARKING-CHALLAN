const mongoose = require('mongoose');


const stationAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    stationName: {
        type: String,
        required: true,
        unique: true,
    },

});


const stationadmin = mongoose.model("stationadmin", stationAdminSchema);
module.exports = stationadmin;