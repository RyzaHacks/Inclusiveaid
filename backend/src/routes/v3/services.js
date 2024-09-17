//inclusive-aid\backend\src\routes\v3\services.js
const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/v3/serviceController');
const auth = require('../../middleware/auth');
const { isAdmin, isAdminOrClient } = require('../../middleware/roleMiddleware');

router.get('/', auth, isAdminOrClient, serviceController.getAllServices);
router.get('/:id', auth, isAdminOrClient, serviceController.getServiceById);
router.post('/', auth, isAdmin, serviceController.createService);
router.put('/:id', auth, isAdmin, serviceController.updateService);
router.delete('/:id', auth, isAdmin, serviceController.deleteService);

module.exports = router;
