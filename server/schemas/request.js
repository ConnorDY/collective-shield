const mongoose = require("mongoose");

const address = {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
}

const requestSchema = new mongoose.Schema({
    address: address,
    details: String,
    count: Number,
    createDate: Date,
    coordinates: [Number],
    name: String,
    email: String,
    position: String,
    makerId: String,
})

const Request = mongoose.model('request', requestSchema);

module.exports = {
    requestSchema: requestSchema,
    Request: Request,
}
