//inclusive-aid\backend\src\routes\v3\index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const adminSettingsRoutes = require('./adminSettings');
const serviceAssignmentRoutes = require('./serviceAssignments');
const serviceRoutes = require('./services');
const ndisPlanRoutes = require('./ndisPlans');
const adminRoutes = require('./admin');
const roleRoutes = require('./roles');
const serviceCoordinationRoutes = require('./serviceCoordination');
const serviceWorkerRoutes = require('./serviceWorkers'); // New addition

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin-settings', adminSettingsRoutes);
router.use('/service-assignments', serviceAssignmentRoutes);
router.use('/services', serviceRoutes);
router.use('/ndis-plans', ndisPlanRoutes);
router.use('/admin', adminRoutes);
router.use('/roles', roleRoutes);
router.use('/service-coordination', serviceCoordinationRoutes);
router.use('/service-workers', serviceWorkerRoutes); // New addition

module.exports = router;