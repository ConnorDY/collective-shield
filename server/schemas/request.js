const addressSchema = require('./address');
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
    address: addressSchema,
    details: String,
    count: Number,
    createDate: Date,
    coordinates: [Number],
    name: String,
})

const Request = mongoose.model('request', requestSchema);

module.exports = {
    requestSchema: requestSchema,
    Request: Request,
}
