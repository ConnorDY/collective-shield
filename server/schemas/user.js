const addressSchema = require('./address');
const mongoose = require("mongoose");

const oauthProviders = {
    facebook: String,
    google: String,
}

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    providers: oauthProviders,
})

const User = mongoose.model('user', userSchema);

module.exports = {
    userSchema: userSchema,
    User: User,
}
