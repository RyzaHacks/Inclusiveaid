// supportTeamRoutes.js
const express = require('express');
const router = express.Router();
const supportTeamController = require('../../controllers/v1/supportTeamController');
const auth = require('../../middleware/auth');
const { isAdminOrClient } = require('../../middleware/roleMiddleware');

router.use(auth);

router.get('/', supportTeamController.getSupportTeamForClient);
router.get('/:userId', isAdminOrClient, supportTeamController.getSupportTeamForClient);
router.get('/:userId/service-workers', isAdminOrClient, supportTeamController.getAssignedServiceWorkers);

module.exports = router;