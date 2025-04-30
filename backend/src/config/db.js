const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            retryWrites: true,
            w: 'majority'
        };

        // Add SSL and authSource only in production
        if (process.env.NODE_ENV === 'production') {
            options.ssl = true;
            options.authSource = 'admin';
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, options);
        console.log(`Connected to MongoDB in ${process.env.NODE_ENV} mode at ${process.env.MONGODB_URI}`);

        mongoose.connection.on('error', err => {
            console.error('MongoDB error:', err);
        });

        return conn;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        console.error('Current environment:', process.env.NODE_ENV);
        console.error('MongoDB URI:', process.env.MONGODB_URI);
        process.exit(1);
    }
};

module.exports = connectDB;