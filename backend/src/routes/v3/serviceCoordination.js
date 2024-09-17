const express = require('express');
const router = express.Router();
const serviceCoordinationController = require('../../controllers/v3/serviceCoordinationController');

// Define routes
router.get('/active-clients', serviceCoordinationController.getActiveClients);
router.get('/pending-tasks', serviceCoordinationController.getPendingTasks);
router.get('/upcoming-appointments', serviceCoordinationController.getUpcomingAppointments);
router.get('/service-metrics', serviceCoordinationController.getServiceMetrics);
router.get('/support-team', serviceCoordinationController.getSupportTeam);
router.get('/service-workers', serviceCoordinationController.getServiceWorkers);
router.get('/services', serviceCoordinationController.getServices);
router.get('/service-assignments', serviceCoordinationController.getServiceAssignments);
router.get('/clients-with-services', serviceCoordinationController.getClientsWithServices);

module.exports = router;