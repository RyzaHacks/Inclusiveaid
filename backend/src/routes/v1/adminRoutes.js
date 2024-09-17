// adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/v1/userAdminController');
const userAdminController = require('../../controllers/v1/userAdminController');
const serviceAdminController = require('../../controllers/v1/serviceAdminController');
const supportTeamAdminController = require('../../controllers/v1/supportTeamAdminController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleMiddleware');

router.use(auth);
router.use(isAdmin);

// Dashboard
router.get('/dashboard-stats', adminController.getDashboardStats);

// User management
router.get('/users', userAdminController.getAllUsers);
router.post('/users', userAdminController.addUser);
router.put('/users/:id', userAdminController.updateUser);
router.delete('/users/:id', userAdminController.deleteUser);
router.get('/users/clients', userAdminController.getClients);
router.get('/users/service-workers', userAdminController.getServiceWorkers);

// Service management
router.post('/services', serviceAdminController.createService);
router.put('/services/:id', serviceAdminController.updateService);
router.delete('/services/:id', serviceAdminController.deleteService);

// NDIS Plan management
router.get('/ndis-plans', userAdminController.getAllNDISPlans);
router.put('/ndis-plans/:id', userAdminController.updateNDISPlan);

// Support team management
router.post('/support-team/:userId', supportTeamAdminController.addSupportTeamMember);
router.put('/support-team/:userId', supportTeamAdminController.updateSupportTeam);
router.delete('/support-team/:userId/:workerId', supportTeamAdminController.removeSupportTeamMember);

module.exports = router;