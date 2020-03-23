const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: String,
    apt: String,
    city: String,
    state: String,
    zip: String,
    phone: String,
})

module.exports = {
    addressSchema: addressSchema,
};
