const mongoose = require('mongoose');
const schema = mongoose.Schema;

const authoritySchema = new schema({

    name: String,
    password: String,
    username: String,
    station: String,
    email: String,
    mobile_no: Number

});

module.exports = authoritySchema;