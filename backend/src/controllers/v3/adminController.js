const db = require('../../config/database');
const { Op } = require('sequelize');
const os = require('os');

// Fetch general dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const activeNdisPlans = await db.NDISPlan.count({ where: { status: 'active' } });
    const upcomingAppointments = await db.Appointment.count({ 
      where: {
        dateTime: { [Op.gte]: new Date() },
        status: 'scheduled'
      }
    });

    const adminRole = await db.Role.findOne({ where: { name: 'admin' } });
    const dashboardConfig = adminRole.dashboardConfig || {};

    res.json({
      totalUsers,
      activeNdisPlans,
      upcomingAppointments,
      dashboardConfig,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Fetch user growth statistics
exports.getUserGrowth = async (req, res) => {
  try {
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

    let formattedUserGrowth = userGrowth.map(item => ({
      date: item.get('date'),
      count: parseInt(item.get('count'))
    }));

    // If there's no data, create dummy data for the last 7 days
    if (formattedUserGrowth.length === 0) {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        formattedUserGrowth.push({
          date: date.toISOString().split('T')[0],
          count: 0
        });
      }
    }

    res.json(formattedUserGrowth);
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({ message: 'Error fetching user growth', error: error.message });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const totalServices = await db.Service.count();

    const clientRole = await db.Role.findOne({ where: { name: 'client' } });
    if (!clientRole) {
      throw new Error('Client role not found');
    }

    const activeClients = await db.User.count({
      where: { roleId: clientRole.id },
    });

    const userGrowth = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
      ],
      where: {
        createdAt: {
          [db.Sequelize.Op.gte]: db.sequelize.literal('DATE_SUB(CURDATE(), INTERVAL 7 DAY)'),
        },
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('createdAt'))],
      order: [[db.sequelize.fn('DATE', db.sequelize.col('createdAt')), 'ASC']],
    });

    const recentAppointments = await db.ServiceAssignment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.User, as: 'client', attributes: ['id', 'name'] },
        { model: db.Service, as: 'service', attributes: ['id', 'name'] },
      ],
    });

    const adminRole = await db.Role.findOne({ where: { name: 'admin' } });

    // Check if dashboardConfig is a string and needs parsing, otherwise use it as it is
    let dashboardConfig;
    if (typeof adminRole.dashboardConfig === 'string') {
      dashboardConfig = JSON.parse(adminRole.dashboardConfig);
    } else {
      dashboardConfig = adminRole.dashboardConfig || {};
    }

    res.json({
      totalUsers,
      totalServices,
      activeClients,
      userGrowth,
      recentAppointments,
      dashboardConfig,
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};


// Fetch service utilization statistics
exports.getServiceUtilization = async (req, res) => {
  try {
    const serviceUsage = await db.ServiceAssignment.findAll({
      attributes: [
        [db.sequelize.col('service.name'), 'serviceName'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
      ],
      include: [{ 
        model: db.Service, 
        as: 'service',
        attributes: [] 
      }],
      group: ['service.id', 'service.name'],
      order: [[db.sequelize.fn('COUNT', '*'), 'DESC']],
      limit: 5,
    });

    res.json({
      popularServices: {
        labels: serviceUsage.map((service) => service.get('serviceName')),
        datasets: [
          {
            label: 'Service Usage',
            data: serviceUsage.map((service) => service.get('count')),
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching service utilization:', error);
    res.status(500).json({ message: 'Error fetching service utilization', error: error.message });
  }
};

// Fetch recent appointments
exports.getRecentAppointments = async (req, res) => {
  try {
    const recentAppointments = await db.ServiceAssignment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { model: db.User, as: 'client', attributes: ['id', 'name'] },
        { model: db.Service, as: 'service', attributes: ['id', 'name'] }, // Specify the alias 'service'
      ],
    });

    res.json(recentAppointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    res.status(500).json({ message: 'Error fetching recent appointments', error: error.message });
  }
};

exports.getRoleSidebar = async (req, res) => {
  try {
    const { roleName } = req.params;
    const role = await db.Role.findOne({ where: { name: roleName } });

    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // If sidebarItems is stored as a JSON string, parse it
    const sidebarItems = typeof role.sidebarItems === 'string' 
      ? JSON.parse(role.sidebarItems) 
      : role.sidebarItems;

    res.json(sidebarItems || []);
  } catch (error) {
    console.error('Error fetching role sidebar:', error);
    res.status(500).json({ message: 'Error fetching role sidebar', error: error.message });
  }
};
// Fetch system health information
exports.getSystemHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();

    res.json({
      uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m`,
      cpuUsage: `${((cpuUsage.user + cpuUsage.system) / 1000000).toFixed(2)}%`,
      memoryUsage: `${((memoryUsage.heapUsed / totalMemory) * 100).toFixed(2)}%`,
      diskSpace: '80%', // Placeholder for actual disk space check
    });
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ message: 'Error fetching system health', error: error.message });
  }
};

// Fetch NDIS plan analytics
exports.getNdisPlanAnalytics = async (req, res) => {
  try {
    const totalBudget = await db.NDISPlan.sum('totalBudget');
    const usedBudget = await db.NDISPlan.sum('usedBudget');

    const remainingBudget = totalBudget - usedBudget;
    const activePlansCount = await db.NDISPlan.count({ where: { status: 'active' } });
    const averageUtilization = (usedBudget / totalBudget) * 100;

    res.json({
      budgetUtilization: {
        labels: ['Used Budget', 'Remaining Budget'],
        datasets: [
          {
            data: [usedBudget, remainingBudget],
            backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
          },
        ],
      },
      totalBudget,
      usedBudget,
      remainingBudget,
      activePlansCount,
      averageUtilization: averageUtilization.toFixed(2),
    });
  } catch (error) {
    console.error('Error fetching NDIS plan analytics:', error);
    res.status(500).json({ message: 'Error fetching NDIS plan analytics', error: error.message });
  }
};

// User assignment-related operations
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
exports.getUserActivity = async (req, res) => {
  try {
    const lastWeek = new Date(new Date() - 7 * 24 * 60 * 60 * 1000); // Calculate the date one week ago
    const userLogins = await db.User.findAll({
      attributes: [
        [db.sequelize.fn('DATE', db.sequelize.col('lastLoginAt')), 'date'],
        [db.sequelize.fn('COUNT', '*'), 'count'],
      ],
      where: {
        lastLoginAt: {
          [Op.gte]: lastWeek, // Filter logins from the last week
        },
      },
      group: [db.sequelize.fn('DATE', db.sequelize.col('lastLoginAt'))], // Group by the date of login
      order: [[db.sequelize.fn('DATE', db.sequelize.col('lastLoginAt')), 'ASC']], // Order by date ascending
    });

    res.json({
      loginData: {
        labels: userLogins.map((login) => login.get('date')),
        datasets: [
          {
            label: 'User Logins',
            data: userLogins.map((login) => login.get('count')),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ message: 'Error fetching user activity', error: error.message });
  }
};

module.exports = exports;
