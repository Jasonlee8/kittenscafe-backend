'use strict';

const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    quantity: Number
})

module.exports = mongoose.model('menu', MenuSchema);