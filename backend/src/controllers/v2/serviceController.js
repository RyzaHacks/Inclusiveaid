//controllers/v2/serviceController.js
const db = require('../../config/database');

exports.getAllServices = async (req, res) => {
  try {
    const services = await db.Service.findAll();
    res.json(services);
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;
    const service = await db.Service.create({ name, description, category, price, duration });
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, duration, status } = req.body;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.update({ name, description, category, price, duration, status });
    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.destroy();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};
