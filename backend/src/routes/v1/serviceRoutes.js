// serviceRoutes.js
const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/v1/serviceController');
const serviceAssignmentController = require('../../controllers/v1/serviceAssignmentController');
const auth = require('../../middleware/auth');
const { isClient, isServiceWorker, isAdminOrClient } = require('../../middleware/roleMiddleware');

router.use(auth);

router.get('/', isAdminOrClient, serviceController.getAllServices);
router.get('/:id', isAdminOrClient, serviceController.getServiceById);
router.get('/client/:userId', isClient, serviceController.getClientServices);
router.get('/worker/:userId', isServiceWorker, serviceController.getWorkerServices);

router.post('/assignments', isAdminOrClient, serviceAssignmentController.createServiceAssignment);
router.get('/assignments/client/:clientId', isAdminOrClient, serviceAssignmentController.getServiceAssignmentsForClient);
router.put('/assignments/:id', isAdminOrClient, serviceAssignmentController.updateServiceAssignment);
router.delete('/assignments/:id', isAdminOrClient, serviceAssignmentController.deleteServiceAssignment);

module.exports = router;