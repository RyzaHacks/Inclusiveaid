// controllers/v3/adminSettingsController.js
const db = require('../../config/database');
const { AdminSettings } = db;

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await AdminSettings.findAll();
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch admin settings' });
  }
};

exports.createSetting = async (req, res) => {
  try {
    const setting = await AdminSettings.create(req.body);
    res.status(201).json({ success: true, data: setting });
  } catch (error) {
    console.error('Error creating admin setting:', error);
    res.status(500).json({ success: false, error: 'Failed to create admin setting' });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await AdminSettings.update(req.body, {
      where: { id }
    });
    if (updated) {
      const updatedSetting = await AdminSettings.findOne({ where: { id } });
      res.status(200).json({ success: true, data: updatedSetting });
    } else {
      res.status(404).json({ success: false, error: 'Admin setting not found' });
    }
  } catch (error) {
    console.error('Error updating admin setting:', error);
    res.status(500).json({ success: false, error: 'Failed to update admin setting' });
  }
};

exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AdminSettings.destroy({
      where: { id }
    });
    if (deleted) {
      res.status(200).json({ success: true, message: 'Admin setting deleted successfully' });
    } else {
      res.status(404).json({ success: false, error: 'Admin setting not found' });
    }
  } catch (error) {
    console.error('Error deleting admin setting:', error);
    res.status(500).json({ success: false, error: 'Failed to delete admin setting' });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const totalServices = await db.Service.count();
    const activeClients = await db.User.count({
      where: { role: 'client', status: 'active' }
    });

    const thirtyDaysAgo = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
    const userGrowth = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count']
      ],
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo
        }
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']]
    });

    const recentAppointments = await db.ServiceAssignment.findAll({
      where: { status: 'scheduled' },
      include: [
        { model: db.Service, as: 'service', attributes: ['name'] },
        { model: db.User, as: 'client', attributes: ['name'] }
      ],
      order: [['date', 'DESC']],
      limit: 10
    });

    res.json({
      totalUsers,
      totalServices,
      activeClients,
      userGrowth: userGrowth.map(ug => ({
        date: ug.get('date'),
        count: parseInt(ug.get('count'))
      })),
      recentAppointments: recentAppointments.map(ra => ({
        service: { name: ra.service.name },
        date: ra.date,
        client: { name: ra.client.name }
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};

module.exports = exports;