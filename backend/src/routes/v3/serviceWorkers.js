const express = require('express');
const router = express.Router();
const serviceWorkerController = require('../../controllers/v3/serviceWorkerController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleMiddleware');

router.get('/', auth, serviceWorkerController.getAllServiceWorkers);
router.get('/:id', auth, serviceWorkerController.getServiceWorkerById);
router.post('/', auth, isAdmin, serviceWorkerController.createServiceWorker);
router.put('/:id', auth, isAdmin, serviceWorkerController.updateServiceWorker);
router.delete('/:id', auth, isAdmin, serviceWorkerController.deleteServiceWorker);
router.put('/:id/assignments', auth, isAdmin, serviceWorkerController.updateServiceWorkerAssignments);

module.exports = router;