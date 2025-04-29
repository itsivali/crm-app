const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    unit_price: {
        type: Number,
        required: true
    },
    description_override: String,
    subtotal: Number
});

const invoiceSchema = new mongoose.Schema({
    invoice_number: {
        type: String,
        required: true,
        unique: true
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    items: [invoiceItemSchema],
    date_issued: {
        type: Date,
        required: true
    },
    date_due: {
        type: Date,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax_amount: {
        type: Number,
        default: 0
    },
    discount_amount: {
        type: Number,
        default: 0
    },
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING', 'PAID', 'CANCELLED'],
        default: 'DRAFT'
    },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);