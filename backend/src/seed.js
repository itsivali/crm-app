const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Client = require('./models/Client');
const Service = require('./models/Service');
const Invoice = require('./models/Invoice');
const Receipt = require('./models/Receipt');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Client.deleteMany({});
        await Service.deleteMany({});
        await Invoice.deleteMany({});
        await Receipt.deleteMany({});

        // Seed clients
        const clients = await Client.insertMany([
            { name: 'Alice Smith', company: 'Acme Corp', address: '123 Main St', email: 'alice@acme.com', phone: '123-456-7890', notes: 'Preferred client' },
            { name: 'Bob Jones', company: 'Beta LLC', address: '456 Oak Ave', email: 'bob@beta.com', phone: '987-654-3210' },
        ]);

        // Seed services
        const services = await Service.insertMany([
            { sku: 'SVC001', description: 'Web Design', unit_price: 1200, tax_rate: 15 },
            { sku: 'SVC002', description: 'Consulting', unit_price: 250, tax_rate: 10 },
        ]);

        // Calculate invoice data
        const invoice1Subtotal = services[0].unit_price * 1; // 1200
        const invoice2Subtotal = services[1].unit_price * 2; // 500

        // Seed invoices
        const invoices = await Invoice.insertMany([
            {
                invoice_number: '10001',
                client: clients[0]._id,
                items: [{
                    service: services[0]._id,
                    quantity: 1,
                    unit_price: services[0].unit_price,
                    subtotal: invoice1Subtotal
                }],
                date_issued: new Date('2024-01-01'),
                date_due: new Date('2024-01-31'),
                subtotal: invoice1Subtotal,
                tax_amount: 180,
                total_amount: 1380,
                status: 'PAID'
            },
            {
                invoice_number: '10002',
                client: clients[1]._id,
                items: [{
                    service: services[1]._id,
                    quantity: 2,
                    unit_price: services[1].unit_price,
                    subtotal: invoice2Subtotal
                }],
                date_issued: new Date('2024-02-01'),
                date_due: new Date('2024-02-28'),
                subtotal: invoice2Subtotal,
                tax_amount: 50,
                total_amount: 550,
                status: 'PENDING'
            }
        ]);

        // Seed receipts
        await Receipt.insertMany([
            {
                receipt_number: '50001',
                invoice: invoices[0]._id,
                date_paid: new Date('2024-01-15'),
                amount_paid: 1380,
                payment_method: 'CREDIT_CARD'
            }
        ]);

        console.log('Database seeded successfully');
        return true; // Return instead of exiting
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error; // Throw instead of exiting
    }
};

// Export the function instead of running it directly
module.exports = { seedData };