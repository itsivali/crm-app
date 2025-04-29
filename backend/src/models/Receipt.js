const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receipt_number: {
        type: String,
        required: true,
        unique: true
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice',
        required: true
    },
    date_paid: {
        type: Date,
        required: true
    },
    amount_paid: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        enum: ['CASH', 'M-PESA', 'CREDIT_CARD', 'BANK_TRANSFER'],
        required: true
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Receipt', receiptSchema);