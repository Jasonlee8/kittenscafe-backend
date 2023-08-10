'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const UploadSchema = new Schema({
    email: String,
    filename: String,
    avatar: String
})

module.exports = mongoose.model('upload', UploadSchema);