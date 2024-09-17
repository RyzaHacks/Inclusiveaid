const db = require('../../config/database');
const { Op } = require('sequelize');

// Fetch active clients
exports.getActiveClients = async (req, res) => {
  try {
    const clientRole = await db.Role.findOne({ where: { name: 'client' } });
    if (!clientRole) {
      return res.status(404).json({ message: 'Client role not found' });
    }

    const activeClients = await db.User.findAll({
      where: {
        roleId: clientRole.id,
        isActive: true
      },
      attributes: ['id', 'name', 'status']
    });

    res.json(activeClients);
  } catch (error) {
    console.error('Error fetching active clients:', error);
    res.status(500).json({ message: 'Error fetching active clients', error: error.message });
  }
};

// Fetch pending tasks
exports.getPendingTasks = async (req, res) => {
  try {
    const pendingTasks = await db.ServiceAssignment.findAll({
      where: {
        status: 'scheduled',
        dateTime: {
          [Op.gte]: new Date()
        }
      },
      attributes: ['id', 'notes', 'dateTime'],
      include: [
        { model: db.User, as: 'client', attributes: ['name'] },
        { model: db.Service, as: 'service', attributes: ['name'] }
      ]
    });

    res.json(pendingTasks);
  } catch (error) {
    console.error('Error fetching pending tasks:', error);
    res.status(500).json({ message: 'Error fetching pending tasks', error: error.message });
  }
};

// Fetch upcoming appointments
exports.getUpcomingAppointments = async (req, res) => {
  try {
    const upcomingAppointments = await db.ServiceAssignment.findAll({
      where: {
        dateTime: {
          [Op.gte]: new Date()
        },
        status: 'scheduled'
      },
      include: [
        {
          model: db.User,
          as: 'client',
          attributes: ['name']
        },
        {
          model: db.Service,
          as: 'service',
          attributes: ['name']
        }
      ],
      attributes: ['id', 'dateTime', 'status']
    });

    res.json(upcomingAppointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({ message: 'Error fetching upcoming appointments', error: error.message });
  }
};

// Fetch service metrics
exports.getServiceMetrics = async (req, res) => {
  try {
    const clientRole = await db.Role.findOne({ where: { name: 'client' } });
    if (!clientRole) {
      return res.status(404).json({ message: 'Client role not found' });
    }

    const totalClients = await db.User.count({
      where: {
        roleId: clientRole.id
      }
    });

    const activeServices = await db.Service.count({
      where: { status: 'active' }
    });

    const avgResponseTime = await db.ServiceAssignment.findAll({
      attributes: [[db.sequelize.fn('AVG', db.sequelize.col('dateTime')), 'avgResponseTime']]
    }).then(result => result[0].get('avgResponseTime'));

    const clientSatisfaction = 95; // Placeholder for actual satisfaction calculation

    res.json({
      totalClients,
      activeServices,
      avgResponseTime: parseFloat(avgResponseTime).toFixed(2),
      clientSatisfaction
    });
  } catch (error) {
    console.error('Error fetching service metrics:', error);
    res.status(500).json({ message: 'Error fetching service metrics', error: error.message });
  }
};

// Fetch support team members
exports.getSupportTeam = async (req, res) => {
  try {
    const supportTeam = await db.SupportTeamMember.findAll({
      include: [
        { model: db.User, as: 'member', attributes: ['name'] },
        { model: db.User, as: 'client', attributes: ['name'] }
      ],
      attributes: ['id', 'role', 'isNdisPlanManager']
    });

    res.json(supportTeam);
  } catch (error) {
    console.error('Error fetching support team:', error);
    res.status(500).json({ message: 'Error fetching support team', error: error.message });
  }
};

// Fetch service workers
exports.getServiceWorkers = async (req, res) => {
  try {
    const serviceWorkers = await db.ServiceWorker.findAll({
      include: [
        { model: db.User, as: 'user', attributes: ['name'] }
      ],
      attributes: ['id', 'specialties']
    });

    res.json(serviceWorkers);
  } catch (error) {
    console.error('Error fetching service workers:', error);
    res.status(500).json({ message: 'Error fetching service workers', error: error.message });
  }
};

// Fetch services
exports.getServices = async (req, res) => {
  try {
    const services = await db.Service.findAll({
      attributes: ['id', 'name', 'description', 'status']
    });

    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

// Fetch service assignments
exports.getServiceAssignments = async (req, res) => {
  try {
    const assignments = await db.ServiceAssignment.findAll({
      include: [
        { model: db.User, as: 'client', attributes: ['name'] },
        { model: db.Service, as: 'service', attributes: ['name'] },
        { model: db.ServiceWorker, as: 'serviceWorker', include: [{ model: db.User, as: 'user', attributes: ['name'] }] }
      ],
      attributes: ['id', 'status', 'dateTime', 'notes']
    });

    res.json(assignments);
  } catch (error) {
    console.error('Error fetching service assignments:', error);
    res.status(500).json({ message: 'Error fetching service assignments', error: error.message });
  }
};

// Create a new service assignment
exports.createServiceAssignment = async (req, res) => {
  try {
    const { clientId, serviceId, serviceWorkerId, dateTime, status, notes } = req.body;
    const newAssignment = await db.ServiceAssignment.create({
      clientId,
      serviceId,
      serviceWorkerId,
      dateTime,
      status,
      notes
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    console.error('Error creating service assignment:', error);
    res.status(500).json({ message: 'Error creating service assignment', error: error.message });
  }
};

// Update a service assignment
exports.updateServiceAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, serviceId, serviceWorkerId, dateTime, status, notes } = req.body;
    const updatedAssignment = await db.ServiceAssignment.update(
      { clientId, serviceId, serviceWorkerId, dateTime, status, notes },
      { where: { id }, returning: true }
    );
    if (updatedAssignment[0] === 0) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    res.json(updatedAssignment[1][0]);
  } catch (error) {
    console.error('Error updating service assignment:', error);
    res.status(500).json({ message: 'Error updating service assignment', error: error.message });
  }
};

// Delete a service assignment
exports.deleteServiceAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db.ServiceAssignment.destroy({ where: { id } });
    if (deletedCount === 0) {
      return res.status(404).json({ message: 'Service assignment not found' });
    }
    res.json({ message: 'Service assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting service assignment:', error);
    res.status(500).json({ message: 'Error deleting service assignment', error: error.message });
  }
};

exports.getClientsWithServices = async (req, res) => {
  try {
    const clientsWithServices = await db.User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: db.Role,
          as: 'role',
          where: { name: 'client' },
          attributes: []
        },
        {
          model: db.ServiceAssignment,
          as: 'clientAssignments',
          attributes: ['id'],
          include: [
            {
              model: db.Service,
              as: 'service',
              attributes: ['id', 'name']
            }
          ],
          required: true
        }
      ],
      group: ['User.id', 'clientAssignments.id', 'clientAssignments->service.id']
    });

    const formattedClients = clientsWithServices.map(client => ({
      id: client.id,
      name: client.name,
      email: client.email,
      services: client.clientAssignments.map(assignment => ({
        id: assignment.service.id,
        name: assignment.service.name
      }))
    }));

    res.json(formattedClients);
  } catch (error) {
    console.error('Error fetching clients with services:', error);
    res.status(500).json({ message: 'Error fetching clients with services', error: error.message });
  }
};