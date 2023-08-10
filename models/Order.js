'use strict';

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: Number,
    email: String,
    itemTitle: String,
    itemQuantity: Number,
    totalPrice: Number,
    isCaseClosed: Boolean,
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('order', OrderSchema);