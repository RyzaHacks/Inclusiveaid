//routes/v1/index.js:
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');
const ndisPlanRoutes = require('./ndisPlanRoutes');
const supportTeamRoutes = require('./supportTeamRoutes');
const messageRoutes = require('./messageRoutes');
const adminRoutes = require('./adminRoutes');
const notificationAndActivityRoutes = require('./notificationAndActivityRoutes');

router.use('/users', userRoutes);
router.use('/services', serviceRoutes);
router.use('/ndis-plans', ndisPlanRoutes);
router.use('/support-team', supportTeamRoutes);
router.use('/messages', messageRoutes);
router.use('/admin', adminRoutes);
router.use('/', notificationAndActivityRoutes);

module.exports = router;