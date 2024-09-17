// inclusive-aid\backend\src\middleware\auth.js
const jwt = require('jsonwebtoken');
const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.User.findOne({ 
      where: { id: decoded.userId },
      include: [{ model: db.Role, as: 'role' }]
    });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};