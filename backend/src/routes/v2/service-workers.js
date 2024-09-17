//routes/v2/service-workers.js
const express = require('express');
const router = express.Router();
const serviceWorkerController = require('../../controllers/v2/serviceWorkerController');
const { isAdmin, isAdminOrServiceWorker } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

router.get('/', auth, isAdmin, serviceWorkerController.getAllServiceWorkers);
router.get('/:id', auth, isAdmin, serviceWorkerController.getServiceWorkerById);

module.exports = router;