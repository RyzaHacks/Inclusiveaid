// routes/v2/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const clientRoutes = require('./clients');
const serviceWorkerRoutes = require('./service-workers');
const supportTeamRoutes = require('./support-team');
const messageRoutes = require('./messages');
const notificationRoutes = require('./notifications');
const activityLogRoutes = require('./activity-logs');
const adminRoutes = require('./admin');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/service-workers', serviceWorkerRoutes);
router.use('/support-team', supportTeamRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);
router.use('/activity-logs', activityLogRoutes);
router.use('/admin', adminRoutes);

module.exports = router;