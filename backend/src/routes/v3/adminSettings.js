//inclusive-aid\backend\src\routes\v3\adminSettings.js
const express = require('express');
const router = express.Router();
const adminSettingsController = require('../../controllers/v3/adminSettingsController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleMiddleware');
const { body } = require('express-validator');
const validateRequest = require('../../middleware/validateRequest');

router.get('/', auth, isAdmin, adminSettingsController.getAllSettings);

router.post('/', 
  auth, 
  isAdmin, 
  [
    body('settingKey').notEmpty().withMessage('Setting key is required'),
    body('settingValue').notEmpty().withMessage('Setting value is required'),
    validateRequest
  ],
  adminSettingsController.createSetting
);

router.put('/:id', 
  auth, 
  isAdmin, 
  [
    body('settingValue').notEmpty().withMessage('Setting value is required'),
    validateRequest
  ],
  adminSettingsController.updateSetting
);

router.delete('/:id', auth, isAdmin, adminSettingsController.deleteSetting);

// New route for dashboard data
router.get('/dashboard', auth, isAdmin, adminSettingsController.getDashboardData);

module.exports = router;