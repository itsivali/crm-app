const Invoice = require('../models/Invoice');
const Receipt = require('../models/Receipt');

async function nextInvoiceNumber() {
    const lastInvoice = await Invoice.findOne()
        .sort({ invoice_number: -1 })
        .select('invoice_number');
    return lastInvoice ? lastInvoice.invoice_number + 1 : 10001;
}

async function nextReceiptNumber() {
    const lastReceipt = await Receipt.findOne()
        .sort({ receipt_number: -1 })
        .select('receipt_number');
    return lastReceipt ? lastReceipt.receipt_number + 1 : 50001;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function generateInvoicePDF(doc, invoice) {
    // Header
    doc.fontSize(20).text(`Invoice #${invoice.invoice_number}`, { align: 'center' });
    doc.moveDown();

    // Client Information
    doc.fontSize(12);
    doc.text(`Bill To:`);
    doc.text(invoice.client.name);
    doc.text(invoice.client.address || '');
    doc.text(`Email: ${invoice.client.email}`);
    doc.moveDown();

    // Dates
    doc.text(`Date Issued: ${invoice.date_issued.toLocaleDateString()}`);
    doc.text(`Due Date: ${invoice.date_due.toLocaleDateString()}`);
    doc.moveDown();

    // Items Table
    doc.text('Items:', { underline: true });
    doc.moveDown(0.5);

    // Table headers
    const startX = 50;
    doc.text('Description', startX, doc.y);
    doc.text('Qty', 300, doc.y);
    doc.text('Price', 400, doc.y);
    doc.text('Amount', 500, doc.y);

    doc.moveDown();

    // Items
    let y = doc.y;
    invoice.items.forEach(item => {
        const description = item.description_override || item.service.description;
        doc.text(description, startX, y);
        doc.text(item.quantity.toString(), 300, y);
        doc.text(formatCurrency(item.unit_price), 400, y);
        doc.text(formatCurrency(item.subtotal), 500, y);
        y += 20;
    });

    doc.moveDown(2);

    // Totals
    const totalsX = 400;
    doc.text('Subtotal:', totalsX);
    doc.text(formatCurrency(invoice.total_amount - invoice.tax_amount), 500);

    doc.text('Tax:', totalsX);
    doc.text(formatCurrency(invoice.tax_amount), 500);

    if (invoice.discount_amount > 0) {
        doc.text('Discount:', totalsX);
        doc.text(`-${formatCurrency(invoice.discount_amount)}`, 500);
    }

    doc.moveDown();
    doc.fontSize(14);
    doc.text('Total:', totalsX);
    doc.text(formatCurrency(invoice.total_amount), 500);

    // Footer
    doc.moveDown(2);
    doc.fontSize(10);
    doc.text('Thank you for your business!', { align: 'center' });
    if (invoice.notes) {
        doc.moveDown();
        doc.text(`Notes: ${invoice.notes}`);
    }
}

function generateReceiptPDF(doc, receipt, invoice) {
    // Header
    doc.fontSize(20).text(`Receipt #${receipt.receipt_number}`, { align: 'center' });
    doc.moveDown();

    // Client Information
    doc.fontSize(12);
    doc.text(`Received From:`);
    doc.text(invoice.client.name);
    doc.text(invoice.client.address || '');
    doc.text(`Email: ${invoice.client.email}`);
    doc.moveDown();

    // Payment Details
    doc.text(`Date Paid: ${receipt.date_paid.toLocaleDateString()}`);
    doc.text(`Payment Method: ${receipt.payment_method}`);
    doc.text(`Invoice #: ${invoice.invoice_number}`);
    doc.moveDown();

    // Amount
    doc.fontSize(14);
    doc.text('Amount Paid:');
    doc.text(formatCurrency(receipt.amount_paid), { align: 'right' });

    // Footer
    doc.moveDown(2);
    doc.fontSize(10);
    doc.text('Thank you for your payment!', { align: 'center' });
    if (receipt.notes) {
        doc.moveDown();
        doc.text(`Notes: ${receipt.notes}`);
    }
}

module.exports = {
    nextInvoiceNumber,
    nextReceiptNumber,
    generateInvoicePDF,
    generateReceiptPDF,
    formatCurrency
};