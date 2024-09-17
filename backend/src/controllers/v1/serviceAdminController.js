const db = require('../../config/database');

exports.createService = async (req, res) => {
  try {
    const { name, description, category, price, duration } = req.body;
    const service = await db.Service.create({ name, description, category, price, duration });
    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, price, duration } = req.body;
    const service = await db.Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    await service.update({ name, description, category, price, duration });
    res.json({ message: 'Service updated successfully', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
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