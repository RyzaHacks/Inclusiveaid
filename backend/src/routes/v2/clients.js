// routes/v2/clients.js
const express = require('express');
const router = express.Router();
const clientController = require('../../controllers/v2/clientController');
const { isClient } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

// Fetch all dashboard data for a client
router.get('/dashboard', auth, isClient, clientController.getDashboardData);

// NDIS Plan routes
router.get('/ndis-plan', auth, isClient, clientController.getNDISPlan);
router.put('/ndis-plan', auth, isClient, clientController.updateNDISPlan);

// Services routes
router.get('/services', auth, isClient, clientController.getClientServices);
router.post('/schedule-service', auth, isClient, clientController.scheduleService);

// Support team route
router.get('/support-team', auth, isClient, clientController.getSupportTeam);

// Notifications route
router.get('/notifications', auth, isClient, clientController.getNotifications);
router.put('/notifications/:id/read', auth, isClient, clientController.markNotificationAsRead);

// Activity log route
router.get('/activity-log', auth, isClient, clientController.getActivityLog);
router.post('/activity-log', auth, isClient, clientController.logActivity);

module.exports = router;