const addressSchema = require('./address');
const mongoose = require("mongoose");

const userLoginSchema = new mongoose.Schema({
    userId: String,
    accessToken: String,
    refreshToken: String,
    remoteIp: String,
    createDate: Date,
})

const UserLogin = mongoose.model('userlogin', userLoginSchema);

module.exports = {
    userLoginSchema: userLoginSchema,
    UserLogin: UserLogin,
}
