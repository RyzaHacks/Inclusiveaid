const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// Add this function to userController.js
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


exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;

    const users = await db.User.findAndCountAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      },
      include: [{ model: db.Role, as: 'role' }],
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      totalUsers: users.count
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      include: [{ model: db.Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, roleId } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.User.create({
      name,
      email,
      password: hashedPassword,
      roleId
    });

    const createdUser = await db.User.findByPk(newUser.id, {
      include: [{ model: db.Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, roleId, password } = req.body;
    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.roleId = roleId || user.roleId;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    const updatedUser = await db.User.findByPk(user.id, {
      include: [{ model: db.Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await db.User.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      return res.json({ message: 'User deleted successfully' });
    }
    throw new Error('User not found');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.getUserRoles = async (req, res) => {
  try {
    const roles = await db.Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching user roles:', error);
    res.status(500).json({ message: 'Error fetching user roles', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [{ 
        model: db.Role, 
        as: 'role', 
        attributes: ['name', 'dashboardConfig', 'sidebarItems'] 
      }],
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.update({
      name,
      email,
      phoneNumber,
    });

    const updatedUser = await db.User.findByPk(req.user.id, {
      include: [{ model: db.Role, as: 'role', attributes: ['name'] }],
      attributes: { exclude: ['password'] }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// userController.js
exports.getClientDashboard = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await db.User.findByPk(userId, {
      include: [{ model: db.Role, as: 'role' }]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has the required role
    if (user.role.name !== 'client' && user.role.name !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Client or Admin role required.' });
    }

    // Fetch the dashboard data for the client or admin
    const dashboardData = await fetchDashboardData(userId);
    res.json(dashboardData);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

async function fetchDashboardData(userId) {
  // Implement the logic to fetch and return client/admin-specific dashboard data
  return {
    totalServices: 5,
    recentAppointments: [],
    // Other data...
  };
}

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role) {
      return res.status(400).json({ message: 'Role parameter is required.' });
    }

    const users = await db.User.findAll({
      where: {
        '$role.name$': role
      },
      include: [
        {
          model: db.Role,
          as: 'role',
          attributes: ['name']
        }
      ]
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    res.status(500).json({ message: 'Error fetching users by role', error: error.message });
  }
};

