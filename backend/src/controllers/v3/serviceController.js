const db = require('../../config/database');
const { Op } = require('sequelize');

exports.getAllServices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }
    if (category) {
      whereClause.category = category;
    }

    const { count, rows } = await db.Service.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    // Fetch all unique categories
    const categories = await db.Service.findAll({
      attributes: ['category'],
      group: ['category'],
      raw: true
    });

    res.json({
      services: rows,
      totalPages,
      currentPage: parseInt(page),
      totalServices: count,
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error('Error fetching all services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await db.Service.findByPk(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    console.error('Error fetching service by id:', error);
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const newService = await db.Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const [updated] = await db.Service.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedService = await db.Service.findByPk(req.params.id);
      return res.json(updatedService);
    }
    throw new Error('Service not found');
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = await db.Service.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'Service deleted successfully' });
    }
    throw new Error('Service not found');
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};

