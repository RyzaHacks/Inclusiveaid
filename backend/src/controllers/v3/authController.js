//inclusive-aid\backend\src\controllers\v3\authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/database');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.User.findOne({
      where: { email },
      include: [{ model: db.Role, as: 'role' }]
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role ? user.role.name : null 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role ? { id: user.role.id, name: user.role.name } : null
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.logout = async (req, res) => {
  try {
    // Update last logout timestamp
    await db.User.update({ lastLogoutAt: new Date() }, { where: { id: req.user.userId } });
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.userId, {
      include: [{ model: db.Role, as: 'role' }],
      attributes: { exclude: ['password'] }
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      ...user.toJSON(),
      role: user.role ? user.role.name : null
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
};