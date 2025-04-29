const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const Service = require('../models/Service');
const PDFDocument = require('pdfkit');
const sendMail = require('../utils/mailer');
const { nextInvoiceNumber } = require('../utils/helpers');

async function calculateTotalTax(items) {
    try {
        let totalTax = 0;
        for (const item of items) {
            const service = await Service.findById(item.service);
            if (service && service.tax_rate) {
                totalTax += (item.subtotal * service.tax_rate) / 100;
            }
        }
        return totalTax;
    } catch (error) {
        console.error('Error calculating tax:', error);
        throw error;
    }
}

exports.getAll = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate('client')
            .populate('items.service')
            .sort('-date_issued');
        res.json(invoices);
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
};

exports.getById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate('client')
            .populate('items.service');

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        res.json(invoice);
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({ error: 'Failed to fetch invoice' });
    }
};

exports.create = async (req, res) => {
    try {
        const { client_id, items, date_due, date_issued, notes } = req.body;

        if (!client_id || !items || !items.length) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Process items without worrying about _id fields
        const processedItems = await Promise.all(items.map(async (item) => {
            if (!item.service_id) {
                throw new Error('Service ID is required for each item');
            }

            const service = await Service.findById(item.service_id);
            if (!service) {
                throw new Error(`Service ${item.service_id} not found`);
            }

            const quantity = Number(item.quantity) || 1;
            const unit_price = Number(service.unit_price);
            const subtotal = quantity * unit_price;

            return {
                service: item.service_id,
                quantity,
                unit_price,
                description_override: item.description_override || service.description,
                subtotal
            };
        }));

        const invoice = new Invoice({
            invoice_number: await nextInvoiceNumber(),
            client: client_id,
            items: processedItems,
            date_issued: date_issued || new Date(),
            date_due: date_due || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            subtotal: processedItems.reduce((sum, item) => sum + item.subtotal, 0),
            tax_amount: await calculateTotalTax(processedItems),
            notes,
            status: 'DRAFT'
        });

        await invoice.save();
        await invoice.populate(['client', 'items.service']);

        res.status(201).json(invoice);
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: error.message || 'Failed to create invoice' });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (!['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        invoice.status = status;
        await invoice.save();
        await invoice.populate('client items.service');

        res.json(invoice);
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({ error: 'Failed to update invoice status' });
    }
};

exports.remove = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        if (invoice.status === 'PAID') {
            return res.status(400).json({ error: 'Cannot delete paid invoice' });
        }

        await invoice.deleteOne();
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Failed to delete invoice' });
    }
};