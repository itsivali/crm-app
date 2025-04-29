const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const connectDB = require('./config/db');

// Import routes
const clientRoutes = require('./routes/clients');
const serviceRoutes = require('./routes/services');
const invoiceRoutes = require('./routes/invoices');
const receiptRoutes = require('./routes/receipts');

// Initialize express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// JWT auth stub
app.use((req, res, next) => { next(); });

// Mount APIs
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/receipts', receiptRoutes);

// Connect to database before starting server
connectDB();

module.exports = app;