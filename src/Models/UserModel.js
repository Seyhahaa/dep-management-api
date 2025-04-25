const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String},
    email: {type: String, required: true, unique: true},
    phone: {type: String,},
    office: {type: String, },
    position: {type: String, },
    verified: {type: Boolean, default: false},
    role: {type: String, default: 'User'},
    picture: {type: String},
}, {timestamps: true})
const authModel = mongoose.model('Auth', authSchema)

module.exports = authModel