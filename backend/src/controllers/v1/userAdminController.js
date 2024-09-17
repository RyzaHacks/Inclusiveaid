const db = require('../../config/database');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const totalServices = await db.Service.count();
    const activeClients = await db.User.count({ where: { role: 'client', isActive: true } });

    const userGrowth = await db.User.findAll({
      attributes: [
        [db.Sequelize.fn('DATE', db.Sequelize.col('createdAt')), 'date'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
      ],
      group: [db.Sequelize.fn('DATE', db.Sequelize.col('createdAt'))],
      order: [[db.Sequelize.fn('DATE', db.Sequelize.col('createdAt')), 'ASC']],
      limit: 7
    });

    const recentAppointments = await db.ServiceAssignment.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        { 
          model: db.User, 
          as: 'client', 
          attributes: ['id', 'name'] 
        },
        { 
          model: db.Service, 
          as: 'service', 
          attributes: ['id', 'name'] 
        },
        {
          model: db.SupportTeamMember,
          as: 'assignedTeamMember',
          include: [
            {
              model: db.User,
              as: 'member',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.json({
      totalUsers,
      totalServices,
      activeClients,
      userGrowth: userGrowth.map(ug => ({ 
        date: ug.getDataValue('date'), 
        count: parseInt(ug.getDataValue('count')) 
      })),
      recentAppointments: recentAppointments.map(appointment => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        client: appointment.client ? {
          id: appointment.client.id,
          name: appointment.client.name
        } : null,
        service: appointment.service ? {
          id: appointment.service.id,
          name: appointment.service.name
        } : null,
        assignedTeamMember: appointment.assignedTeamMember && appointment.assignedTeamMember.member ? {
          id: appointment.assignedTeamMember.member.id,
          name: appointment.assignedTeamMember.member.name
        } : null
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await db.User.findAll({
      where: { role: 'client' },
      attributes: ['id', 'name', 'email']
    });
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

exports.getServiceWorkers = async (req, res) => {
  try {
    const serviceWorkers = await db.User.findAll({
      where: { role: 'service_worker' },
      attributes: ['id', 'name', 'email']
    });
    res.json(serviceWorkers);
  } catch (error) {
    console.error('Error fetching service workers:', error);
    res.status(500).json({ message: 'Error fetching service workers', error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const user = await db.User.create({
      name,
      email,
      password, // Make sure to hash the password before saving
      role
    });

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({ name, email, role });
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.getAllNDISPlans = async (req, res) => {
  try {
    const ndisPlans = await db.NDISPlan.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(ndisPlans);
  } catch (error) {
    console.error('Error fetching NDIS plans:', error);
    res.status(500).json({ message: 'Error fetching NDIS plans', error: error.message });
  }
};

exports.updateNDISPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate, fundingAmount, supportCategories } = req.body;
    
    const ndisPlan = await db.NDISPlan.findByPk(id);
    if (!ndisPlan) {
      return res.status(404).json({ message: 'NDIS plan not found' });
    }

    await ndisPlan.update({ startDate, endDate, fundingAmount, supportCategories });
    res.json({ message: 'NDIS plan updated successfully', ndisPlan });
  } catch (error) {
    console.error('Error updating NDIS plan:', error);
    res.status(500).json({ message: 'Error updating NDIS plan', error: error.message });
  }
};