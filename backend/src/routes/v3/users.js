const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v3/userController');
const roleController = require('../../controllers/v3/roleController');
const { isAdmin, isClient, isAdminOrSelf } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

// Logging middleware
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Public routes
router.post('/register', userController.createUser);

// Protected routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

router.get('/', auth, isAdmin, userController.getAllUsers);
router.get('/roles', auth, userController.getUserRoles);
router.get('/:id', auth, isAdminOrSelf, userController.getUserById);
router.put('/:id', auth, isAdminOrSelf, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);
router.get('/dashboard/:id', auth, userController.getClientDashboard);

router.get('/by-role', auth, isAdmin, userController.getUsersByRole); // Add this route

module.exports = router;