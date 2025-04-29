const Service = require('../models/Service');

exports.getAll = async (req, res) => {
    try {
        const services = await Service.find().sort('sku');
        res.json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

exports.getById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        console.error('Error fetching service:', error);
        res.status(500).json({ error: 'Failed to fetch service' });
    }
};

exports.create = async (req, res) => {
    try {
        const { sku, description, unit_price, tax_rate } = req.body;
        const service = new Service({ sku, description, unit_price, tax_rate });
        await service.save();
        res.status(201).json(service);
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({ error: 'Failed to create service' });
    }
};

exports.update = async (req, res) => {
    try {
        const { sku, description, unit_price, tax_rate } = req.body;
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            { sku, description, unit_price, tax_rate },
            { new: true, runValidators: true }
        );
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.json(service);
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({ error: 'Failed to update service' });
    }
};

exports.remove = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({ error: 'Failed to delete service' });
    }
};