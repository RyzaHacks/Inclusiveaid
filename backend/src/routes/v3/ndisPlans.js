const express = require('express');
const router = express.Router();
const ndisPlanController = require('../../controllers/v3/ndisPlanController');
const auth = require('../../middleware/auth');
const { isAdminOrServiceWorker } = require('../../middleware/roleMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../../middleware/validateRequest');

router.get('/admin/all-ndis-plans', auth, isAdminOrServiceWorker, ndisPlanController.getAllNdisPlans);
router.get('/admin/available-service-workers', auth, isAdminOrServiceWorker, ndisPlanController.getAvailableServiceWorkers);
router.get('/admin/:id', auth, isAdminOrServiceWorker, ndisPlanController.getNdisPlanById);
router.get('/admin/client/:clientId', auth, isAdminOrServiceWorker, ndisPlanController.getNdisPlansByClientId);

router.post('/admin', 
  auth, 
  isAdminOrServiceWorker, 
  [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('totalBudget').isFloat().withMessage('Total budget must be a number'),
    body('startDate').isISO8601().toDate().withMessage('Start date must be a valid date'),
    body('endDate').isISO8601().toDate().withMessage('End date must be a valid date'),
    validateRequest
  ],
  ndisPlanController.createNdisPlan
);

router.put('/admin/:id', 
  auth, 
  isAdminOrServiceWorker, 
  [
    body('totalBudget').optional().isFloat().withMessage('Total budget must be a number'),
    body('startDate').optional().isISO8601().toDate().withMessage('Start date must be a valid date'),
    body('endDate').optional().isISO8601().toDate().withMessage('End date must be a valid date'),
    validateRequest
  ],
  ndisPlanController.updateNdisPlan
);

router.delete('/admin/:id', auth, isAdminOrServiceWorker, ndisPlanController.deleteNdisPlan);

router.post('/admin/assign-service-worker', auth, isAdminOrServiceWorker, ndisPlanController.assignServiceWorker);

module.exports = router;