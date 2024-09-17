// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v1/userController');
const auth = require('../../middleware/auth');

// Public Routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected Routes
router.use(auth);
router.get('/me', userController.getMe);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.get('/contacts', userController.getContacts);

module.exports = router;