const Receipt = require('../models/Receipt');
const Invoice = require('../models/Invoice');
const PDFDocument = require('pdfkit');
const sendMail = require('../utils/mailer');
const { nextReceiptNumber } = require('../utils/helpers');

exports.getAll = async (req, res) => {
    try {
        const receipts = await Receipt.find()
            .populate({
                path: 'invoice',
                populate: { path: 'client' }
            })
            .sort('-date_paid');
        res.json(receipts);
    } catch (error) {
        console.error('Error fetching receipts:', error);
        res.status(500).json({ error: 'Failed to fetch receipts' });
    }
};

exports.getById = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id)
            .populate({
                path: 'invoice',
                populate: { path: 'client' }
            });

        if (!receipt) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        res.json(receipt);
    } catch (error) {
        console.error('Error fetching receipt:', error);
        res.status(500).json({ error: 'Failed to fetch receipt' });
    }
};

exports.create = async (req, res) => {
    try {
        const { invoice_id, amount_paid, payment_method, notes } = req.body;

        if (!invoice_id || !amount_paid || !payment_method) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const invoice = await Invoice.findById(invoice_id).populate('client');
        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (invoice.status === 'PAID') {
            return res.status(400).json({ error: 'Invoice is already paid' });
        }

        const receipt_number = await nextReceiptNumber();
        const receipt = new Receipt({
            receipt_number,
            invoice: invoice_id,
            date_paid: new Date(),
            amount_paid,
            payment_method,
            notes
        });

        await receipt.save();
        invoice.status = 'PAID';
        await invoice.save();

        // Generate and send PDF receipt
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfBuffer = Buffer.concat(buffers);
            await sendMail({
                to: invoice.client.email,
                subject: `Receipt #${receipt_number}`,
                html: `<p>Thank you for your payment. Please find your receipt attached.</p>`,
                attachments: [{
                    filename: `receipt_${receipt_number}.pdf`,
                    content: pdfBuffer
                }]
            });
        });

        // Generate PDF content
        generateReceiptPDF(doc, receipt, invoice);
        doc.end();

        await receipt.populate({
            path: 'invoice',
            populate: { path: 'client' }
        });

        res.status(201).json(receipt);
    } catch (error) {
        console.error('Error creating receipt:', error);
        res.status(500).json({ error: 'Failed to create receipt' });
    }
};

exports.remove = async (req, res) => {
    try {
        const receipt = await Receipt.findById(req.params.id);

        if (!receipt) {
            return res.status(404).json({ error: 'Receipt not found' });
        }

        const invoice = await Invoice.findById(receipt.invoice);
        if (invoice) {
            invoice.status = 'PENDING';
            await invoice.save();
        }

        await receipt.deleteOne();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting receipt:', error);
        res.status(500).json({ error: 'Failed to delete receipt' });
    }
};