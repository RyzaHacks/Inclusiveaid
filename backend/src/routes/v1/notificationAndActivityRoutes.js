// notificationAndActivityRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/v1/notificationController');
const activityLogController = require('../../controllers/v1/activityLogController');
const auth = require('../../middleware/auth');

router.use(auth);

router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/:id', notificationController.markNotificationAsRead);
router.post('/notifications', notificationController.createNotification);
router.delete('/notifications/:id', notificationController.deleteNotification);

router.post('/activity-logs', activityLogController.createActivityLog);
router.get('/activity-logs', activityLogController.getActivityLogs);

module.exports = router;