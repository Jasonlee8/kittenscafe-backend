'use strict'

const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    telephone: Number,
    email: String,
    password: String,
    avatar: String,
})

module.exports = mongoose.model('user', UserSchema);