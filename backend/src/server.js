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
const healthRouter = require('./routes/health');

// Initialize express app
const app = express();

// Configure CORS
const allowedOrigins = [
    'http://localhost:3000',
    'https://crm-app-qsz1.onrender.com',
    'https://crm-invoice-app.netlify.app'  
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        console.log('Request origin:', origin); // Debug logging

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            console.log('CORS error for origin:', origin); // Debug logging
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// JWT auth stub
app.use((req, res, next) => { next(); });

// Mount APIs
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api', healthRouter);

// Connect to database before starting server
connectDB();

module.exports = app;