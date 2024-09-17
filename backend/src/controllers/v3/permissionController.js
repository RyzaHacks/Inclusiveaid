// src/controllers/v3/permissionController.js
const db = require('../../config/database');

exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await db.Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ message: 'Error fetching permissions', error: error.message });
  }
};

exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPermission = await db.Permission.create({ name, description });
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ message: 'Error creating permission', error: error.message });
  }
};

// Add other CRUD operations for permissions if needed