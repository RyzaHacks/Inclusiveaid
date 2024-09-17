// controllers/v2/adminController.js

const db = require('../../config/database');
const { Op } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    console.log('DB object:', db); // Log the db object to check its contents

    // Check if the required models exist
    if (!db.User || !db.NDISPlan || !db.Appointment || !db.Service) {
      throw new Error('One or more required models are not defined');
    }

    const totalUsers = await db.User.count();
    console.log('Total Users:', totalUsers);

    const activeNdisPlans = await db.NDISPlan.count({ where: { status: 'active' } });
    console.log('Active NDIS Plans:', activeNdisPlans);

    const upcomingAppointments = await db.Appointment.count({ 
      where: {
        dateTime: { [Op.gte]: new Date() },
        status: 'scheduled'
      }
    });
    console.log('Upcoming Appointments:', upcomingAppointments);

    // User growth data (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const userGrowth = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('date', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('count', db.sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: sevenDaysAgo }
      },
      group: [db.sequelize.fn('date', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('date', db.sequelize.col('createdAt')), 'ASC']]
    });
    console.log('User Growth:', userGrowth);

    // Service utilization
    const services = await db.Service.findAll();
    const serviceUtilization = await Promise.all(services.map(async (service) => {
      const totalAppointments = await db.Appointment.count({ where: { serviceId: service.id } });
      return {
        name: service.name,
        utilizationPercentage: (totalAppointments / totalUsers * 100).toFixed(2)
      };
    }));
    console.log('Service Utilization:', serviceUtilization);

    res.json({
      totalUsers,
      activeNdisPlans,
      upcomingAppointments,
      userGrowthData: {
        labels: userGrowth.map(data => data.get('date')),
        datasets: [{
          label: 'New Users',
          data: userGrowth.map(data => data.get('count')),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      serviceUtilization
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message, stack: error.stack });
  }
};


exports.getUserAssignments = async (req, res) => {
  try {
    const assignments = await db.User.findAll({
      where: { role: 'service_worker' },
      include: [
        { 
          model: db.User, 
          as: 'assignedClients', 
          attributes: ['id', 'name', 'email'],
          through: { attributes: [] }
        }
      ],
      attributes: ['id', 'name', 'email']
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching user assignments:', error);
    res.status(500).json({ message: 'Error fetching user assignments', error: error.message });
  }
};

exports.createUserAssignment = async (req, res) => {
  try {
    const { serviceWorkerId, clientId } = req.body;

    const serviceWorker = await db.User.findByPk(serviceWorkerId);
    if (!serviceWorker || serviceWorker.role !== 'service_worker') {
      return res.status(400).json({ message: 'Invalid service worker' });
    }

    const client = await db.User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client' });
    }

    await serviceWorker.addAssignedClient(client);

    res.status(201).json({ message: 'User assignment created successfully' });
  } catch (error) {
    console.error('Error creating user assignment:', error);
    res.status(500).json({ message: 'Error creating user assignment', error: error.message });
  }
};

exports.updateUserAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientIds } = req.body;

    const serviceWorker = await db.User.findByPk(id);
    if (!serviceWorker || serviceWorker.role !== 'service_worker') {
      return res.status(400).json({ message: 'Invalid service worker' });
    }

    await serviceWorker.setAssignedClients(clientIds);

    res.json({ message: 'User assignment updated successfully' });
  } catch (error) {
    console.error('Error updating user assignment:', error);
    res.status(500).json({ message: 'Error updating user assignment', error: error.message });
  }
};

exports.deleteUserAssignment = async (req, res) => {
  try {
    const { id, clientId } = req.params;

    const serviceWorker = await db.User.findByPk(id);
    if (!serviceWorker || serviceWorker.role !== 'service_worker') {
      return res.status(400).json({ message: 'Invalid service worker' });
    }

    const client = await db.User.findByPk(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client' });
    }

    await serviceWorker.removeAssignedClient(client);

    res.json({ message: 'User assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting user assignment:', error);
    res.status(500).json({ message: 'Error deleting user assignment', error: error.message });
  }
};