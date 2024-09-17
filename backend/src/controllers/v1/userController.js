const Sequelize = require('sequelize');
const db = require('../../config/database');
const { User } = db;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { format } = require('date-fns');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({ name, email, password: hashedPassword, role });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: 'Error during registration', error: error.message });
  }
};
exports.getAvailableServiceWorkers = async (req, res) => {
  try {
    const serviceWorkers = await db.User.findAll({
      where: { role: 'service_worker' },
      attributes: ['id', 'name', 'email']
    });
    res.json(serviceWorkers);
  } catch (error) {
    console.error('Error fetching available service workers:', error);
    res.status(500).json({ message: 'Error fetching available service workers', error: error.message });
  }
}

exports.getAssignedClients = async (req, res) => {
  try {
    // Assuming the logged-in user is a service worker and you want to fetch clients assigned to them
    const serviceWorkerId = req.user.id;

    // Fetch clients assigned to this service worker
    const assignedClients = await db.User.findAll({
      include: [
        {
          model: db.Service,
          as: 'clientServices',
          where: { serviceWorkerId },
          required: true,
          attributes: ['id', 'name', 'category', 'date']
        }
      ],
      attributes: ['id', 'name', 'email']
    });

    res.json(assignedClients);
  } catch (error) {
    console.error('Error fetching assigned clients:', error);
    res.status(500).json({ message: 'Error fetching assigned clients', error: error.message });
  }
};
// Get user contacts
exports.getContacts = async (req, res) => {
  try {
    const userId = req.user.id;
    const contacts = await db.User.findAll({
      where: {
        id: { [db.Sequelize.Op.ne]: userId }, // Exclude the current user
        role: 'client' // Assuming you want to fetch only clients as contacts
      },
      attributes: ['id', 'name', 'email', 'status']
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Error fetching contacts', error: error.message });
  }
};

// Get assigned service workers for a client

exports.getClientServices = async (req, res) => {
  try {
    const userId = req.user.id;
    const services = await db.Service.findAll({
      where: { clientId: userId },
      include: [{
        model: db.User,
        as: 'serviceWorker',
        attributes: ['id', 'name', 'email', 'status']
      }],
      attributes: ['id', 'name', 'category', 'date']
    });
    res.json(services);
  } catch (error) {
    console.error('Error fetching client services:', error);
    res.status(500).json({ message: 'Error fetching client services', error: error.message });
  }
};
exports.getSupportTeam = async (req, res) => {
  try {
    const clientId = req.user.id;
    const [supportTeam, assignedWorkers] = await Promise.all([
      db.sequelize.query(`
        SELECT 
          ust.support_worker_id,
          sw.name AS service_worker_name,
          sw.email AS service_worker_email,
          sw.phoneNumber AS service_worker_phone
        FROM 
          usersupportteams ust
        JOIN 
          users sw ON ust.support_worker_id = sw.id
        WHERE 
          ust.user_id = :userId
          AND sw.role = 'service_worker'
      `, {
        replacements: { userId: clientId },
        type: db.sequelize.QueryTypes.SELECT
      }),
      db.sequelize.query(`
        SELECT DISTINCT
          u.id AS worker_id,
          u.name AS worker_name,
          u.email AS worker_email,
          u.phoneNumber AS worker_phone
        FROM 
          services s
        JOIN 
          user_services us ON s.id = us.service_id
        JOIN 
          users u ON us.user_id = u.id
        WHERE 
          s.clientId = :userId
      `, {
        replacements: { userId: clientId },
        type: db.sequelize.QueryTypes.SELECT
      })
    ]);

    res.json({
      supportTeam: supportTeam.map(member => ({
        id: member.support_worker_id,
        name: member.service_worker_name,
        email: member.service_worker_email,
        phoneNumber: member.service_worker_phone
      })),
      assignedWorkers: assignedWorkers.map(worker => ({
        id: worker.worker_id,
        name: worker.worker_name,
        email: worker.worker_email,
        phoneNumber: worker.worker_phone
      }))
    });
  } catch (error) {
    console.error('Error fetching support team and assigned workers:', error);
    res.status(500).json({ message: 'Error fetching data', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    try {
      // Log the successful login activity
      await db.ActivityLog.create({
        userId: user.id,
        activityType: 'Login', // Use 'activityType' instead of 'type'
        description: `User ${user.name} logged in successfully`,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error creating activity log:', error);
      // Handle the error or log it for investigation
    }

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
};

// Get current authenticated user
exports.getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(400).json({ message: 'Error fetching user data', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{
        model: db.NDISPlan,
        as: 'ndisPlan',
        attributes: ['ndisNumber', 'totalBudget', 'usedBudget', 'startDate', 'endDate', 'status']
      }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the dateOfBirth
    const formattedUser = user.toJSON();
    if (formattedUser.dateOfBirth) {
      formattedUser.dateOfBirth = format(new Date(formattedUser.dateOfBirth), 'yyyy-MM-dd');
    }

    res.json(formattedUser);
  } catch (error) {
    console.error('GetProfile error:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address, dateOfBirth, emergencyContact, ndisNumber } = req.body;
    const user = await db.User.findByPk(req.user.id, {
      include: [{
        model: db.NDISPlan,
        as: 'ndisPlan'
      }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.emergencyContact = emergencyContact || user.emergencyContact;
    
    if (user.ndisPlan && ndisNumber) {
      user.ndisPlan.ndisNumber = ndisNumber;
      await user.ndisPlan.save();
    } else if (ndisNumber) {
      await db.NDISPlan.create({
        userId: user.id,
        ndisNumber: ndisNumber
      });
    }

    await user.save();

    // Log the activity
    await db.ActivityLog.create({
      userId: user.id,
      activityType: 'Profile Update',
      description: `${user.name} updated their profile`,
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(400).json({ message: 'Error updating user profile', error: error.message });
  }
};


// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'name', 'email', 'role'] });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: 'Error fetching all users', error: error.message });
  }
};

// Update a user (Admin only)
exports.updateUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    console.log('Received update data:', req.body);

    const { id } = req.params;
    const { name, email, role, supportTeam, assignedServices } = req.body;

    // Find the user
    const user = await db.User.findByPk(id);
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user
    await user.update({ name, email, role }, { transaction });

    // Update support team
    await db.SupportTeam.destroy({ where: { clientId: id }, transaction });
    if (supportTeam && supportTeam.length > 0) {
      await db.SupportTeam.bulkCreate(
        supportTeam.map(member => ({
          userId: member.userId,
          clientId: id,
          name: member.name,
          role: 'support_worker'
        })),
        { transaction }
      );
    }

    // Update services
    // First, get all current services for the user
    const currentServices = await db.Service.findAll({
      where: { clientId: id },
      attributes: ['id'],
      transaction
    });

    const currentServiceIds = currentServices.map(s => s.id);

    // Services to remove
    const servicesToRemove = currentServiceIds.filter(id => !assignedServices.includes(id));
    
    // Services to add
    const servicesToAdd = assignedServices.filter(id => !currentServiceIds.includes(id));

    // Remove services
    await db.Service.update(
      { clientId: null },
      { where: { id: servicesToRemove }, transaction }
    );

    // Add services
    await db.Service.update(
      { clientId: id },
      { where: { id: servicesToAdd }, transaction }
    );

    await transaction.commit();
    console.log('Update successful');

    // Fetch the updated user with associations
    const updatedUser = await db.User.findByPk(id, {
      include: [
        { 
          model: db.User, 
          as: 'supportWorkers', 
          through: { model: db.SupportTeam, attributes: ['name', 'role'] } 
        },
        { 
          model: db.Service, 
          as: 'clientServices'
        }
      ]
    });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    await transaction.rollback();
    console.error('Update error:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message, stack: error.stack });
  }
};
// Get all NDIS plans (Admin only)
exports.getAllNDISPlans = async (req, res) => {
  try {
    const ndisPlans = await db.NDISPlan.findAll({
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['name']
        }
      ]
    });

    if (ndisPlans.length === 0) {
      return res.status(404).json({ message: 'No NDIS plans found' });
    }

    res.json(ndisPlans);
  } catch (error) {
    console.error('Error fetching all NDIS plans:', error);
    res.status(500).json({ message: 'Error fetching NDIS plans', error: error.message });
  }
};



// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Manually delete associated records
    await db.NDISPlan.destroy({ where: { userId: id } });
    await db.Service.destroy({ where: { clientId: id } });
    await db.Service.destroy({ where: { serviceWorkerId: id } });

    // Now delete the user
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Get dashboard stats (Admin only)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const totalServices = await db.Service.count();
    const activeClients = await db.User.count({ where: { role: 'client' } });

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
      order: [['date', 'DESC']],
      include: [
        { 
          model: db.Service,
          attributes: ['name']
        },
        {
          model: db.User,
          attributes: ['name']
        }
      ]
    });

    const services = await db.Service.findAll({
      include: [
        { 
          model: db.User, 
          as: 'clients', 
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        { 
          model: db.User, 
          as: 'workers', 
          through: { attributes: [] },
          attributes: ['id', 'name']
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
      recentAppointments: recentAppointments.map(ra => ({
        service: ra.Service ? ra.Service.name : 'Unknown',
        date: ra.date,
        clientName: ra.User ? ra.User.name : 'Unknown'
      })),
      services: services.map(service => ({
        id: service.id,
        name: service.name,
        description: service.description,
        category: service.category,
        price: service.price,
        duration: service.duration,
        status: service.status,
        clients: service.clients.map(client => ({ id: client.id, name: client.name })),
        workers: service.workers.map(worker => ({ id: worker.id, name: worker.name }))
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Assign support team (Admin only)
exports.assignSupportTeam = async (req, res) => {
  try {
    const { clientId, supportTeamId } = req.body;
    const client = await db.User.findByPk(clientId);
    const supportTeam = await db.SupportTeam.findByPk(supportTeamId);

    if (!client || !supportTeam) {
      return res.status(404).json({ message: 'Client or Support Team not found' });
    }

    // Set the userId and clientId correctly
    supportTeam.userId = clientId;
    await supportTeam.save();

    res.json({ message: 'Support Team assigned successfully' });
  } catch (error) {
    console.error('AssignSupportTeam error:', error);
    res.status(500).json({ message: 'Error assigning support team', error: error.message });
  }
};
// Add a new user (Admin only)
exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role, ndisPlan, initialService, supportTeam } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Start a transaction
    const result = await db.sequelize.transaction(async (t) => {
      // Create the user
      const user = await db.User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        role 
      }, { transaction: t });

      // If the user is a client, create NDIS plan
      if (role === 'client' && ndisPlan) {
        await db.NDISPlan.create({
          userId: user.id,
          totalBudget: ndisPlan.totalBudget,
          endDate: ndisPlan.endDate
        }, { transaction: t });
      }

      // Create initial service
      if (initialService) {
        await db.Service.create({
          clientId: user.id,
          name: initialService.type,
          category: initialService.category || 'General',
          price: initialService.price || 0,
          duration: initialService.duration || 60,
          date: initialService.date,
          time: initialService.time
        }, { transaction: t });
      }

      // Assign support team
      if (supportTeam) {
        await db.ClientSupportTeam.create({
          userId: user.id,
          clientId: user.id, // Ensure this is set correctly
          name: supportTeam.name,
          role: supportTeam.role
        }, { transaction: t });
      }

      return user;
    });

    res.status(201).json({ message: 'User added successfully', user: result });
  } catch (error) {
    console.error('AddUser error:', error);
    res.status(400).json({ message: 'Error adding user', error: error.message });
  }
};
exports.getAvailableServices = async (req, res) => {
  try {
    const availableServices = await db.Service.findAll({
      attributes: ['id', 'name', 'category', 'price'],
      where: {
      }
    });
    res.json(availableServices);
  } catch (error) {
    console.error('Error fetching available services:', error);
    res.status(500).json({ message: 'Error fetching available services', error: error.message });
  }
};

exports.getSupportTeamForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch the support team for the user
    const supportTeam = await db.SupportTeam.findAll({
      where: { userId },
      attributes: ['id', 'name', 'role']
    });

    res.json(supportTeam);
  } catch (error) {
    console.error('Error fetching support team for user:', error);
    res.status(500).json({ message: 'Error fetching support team', error: error.message });
  }
};

module.exports = exports;
