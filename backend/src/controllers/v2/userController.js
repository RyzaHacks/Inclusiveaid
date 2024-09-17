// controllers/v2/userController.js

const db = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    let user = await db.User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await db.User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'client' // Default role is client if not specified
    });

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(user);
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'phoneNumber', 'address'],
      include: [
        { model: db.NDISPlan, as: 'ndisPlan' },
        { 
          model: db.User, 
          as: 'supportTeam',
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] }
        }
      ]
    });
    res.json(user);
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    
    const [updatedRowsCount, updatedUsers] = await db.User.update(
      { name, email, phoneNumber, address },
      { 
        where: { id: req.user.id },
        returning: true
      }
    );

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = updatedUsers[0];
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phoneNumber: updatedUser.phoneNumber,
      address: updatedUser.address
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      include: [
        { 
          model: db.User, 
          as: 'supportTeam',
          attributes: ['id', 'name', 'email', 'role'],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.supportTeam);
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// The following functions were from the previous response and are kept for completeness

exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newUser = await db.User.create({ name, email, password, role });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'email', 'role']
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const [updatedRowsCount, updatedUsers] = await db.User.update(
      { name, email, role },
      { 
        where: { id: req.params.id },
        returning: true
      }
    );
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedRowsCount = await db.User.destroy({
      where: { id: req.params.id }
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};