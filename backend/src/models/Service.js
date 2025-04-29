const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    unit_price: {
        type: Number,
        required: true,
        min: 0
    },
    tax_rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);