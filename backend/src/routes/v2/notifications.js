//routes/v2/notifications.js:
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/v2/notificationController');
const { isAdmin } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

router.get('/', auth, notificationController.getNotifications);
router.put('/:id/read', auth, notificationController.markNotificationAsRead);
router.post('/', auth, isAdmin, notificationController.createNotification);
router.delete('/:id', auth, isAdmin, notificationController.deleteNotification);

module.exports = router;