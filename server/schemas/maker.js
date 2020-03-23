const addressSchema = require('./address');
const mongoose = require("mongoose");

const makerSchema = new mongoose.Schema({
    address: addressSchema,
    printers: [String],
    prints: Number,
    joinDate: Date,
    lastLoggedInDate: Date,
    name: String,
    email: String,
    localPickup: Boolean,
    multiship: Boolean,
})

const Maker = mongoose.model('maker', makerSchema);

module.exports = {
    makerSchema: makerSchema,
    Maker: Maker,
}
