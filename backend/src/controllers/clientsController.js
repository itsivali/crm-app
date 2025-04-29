const Client = require('../models/Client');

exports.getAll = async (req, res) => {
    try {
        const clients = await Client.find()
            .sort({ name: 1 }); // Sort by name ascending
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
};

exports.getById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Failed to fetch client' });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, email, company, phone, address, notes } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({
                error: 'Name and email are required'
            });
        }

        // Create new client
        const client = new Client({
            name,
            email,
            company,
            phone,
            address,
            notes
        });

        await client.save();
        res.status(201).json(client);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({
            error: error.message || 'Failed to create client',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const { id } = req.params;

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const client = await Client.findByIdAndUpdate(
            id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
};

exports.remove = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
};