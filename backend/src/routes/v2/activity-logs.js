//activity-logs.js
const express = require('express');
const router = express.Router();
const activityLogController = require('../../controllers/v2/activityLogController');
const auth = require('../../middleware/auth');

router.get('/', auth, activityLogController.getActivityLogs);
router.post('/', auth, activityLogController.createActivityLog);

module.exports = router;