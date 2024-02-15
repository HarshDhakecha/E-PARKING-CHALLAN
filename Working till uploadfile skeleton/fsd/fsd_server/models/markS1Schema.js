const mongoose=require('mongoose');
const schema=mongoose.Schema;

const markS1Schema = new mongoose.Schema({
    Id: { type: String },
    CO1: { type: String },
    CO2: { type: String },
    CO3: { type: String },
    CO4: { type: String },
    CO5: { type: String },
    CO6: { type: String },
});
module.exports =markS1Schema;