//inclusive-aid\backend\src\routes\v3\serviceAssignments.js
const express = require('express');
const router = express.Router();
const serviceAssignmentController = require('../../controllers/v3/serviceAssignmentController');
const auth = require('../../middleware/auth');
const { isAdminOrServiceWorker } = require('../../middleware/roleMiddleware');

router.get('/', auth, isAdminOrServiceWorker, serviceAssignmentController.getAllAssignments);
router.post('/', auth, isAdminOrServiceWorker, serviceAssignmentController.createAssignment);
router.get('/:id', auth, isAdminOrServiceWorker, serviceAssignmentController.getAssignmentById);
router.put('/:id', auth, isAdminOrServiceWorker, serviceAssignmentController.updateAssignment);
router.delete('/:id', auth, isAdminOrServiceWorker, serviceAssignmentController.deleteAssignment);

module.exports = router;
