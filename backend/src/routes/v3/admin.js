const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/v3/adminController');
const roleController = require('../../controllers/v3/roleController');
const permissionController = require('../../controllers/v3/permissionController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleMiddleware');

// Dashboard data routes
router.get('/dashboard', auth, isAdmin, adminController.getDashboardData);
router.get('/user-growth', auth, isAdmin, adminController.getUserGrowth);
router.get('/recent-appointments', auth, isAdmin, adminController.getRecentAppointments);
router.get('/system-health', auth, isAdmin, adminController.getSystemHealth);
router.get('/user-activity', auth, isAdmin, adminController.getUserActivity);
router.get('/service-utilization', auth, isAdmin, adminController.getServiceUtilization);
router.get('/ndis-plan-analytics', auth, isAdmin, adminController.getNdisPlanAnalytics);

// Role routes
router.get('/roles', auth, isAdmin, roleController.getAllRoles);
router.post('/roles', auth, isAdmin, roleController.createRole);
router.put('/roles/:id', auth, isAdmin, roleController.updateRole);
router.delete('/roles/:id', auth, isAdmin, roleController.deleteRole);
router.put('/roles/:id/dashboard', auth, isAdmin, roleController.updateRoleDashboard);
router.put('/roles/:id/sidebar', auth, isAdmin, roleController.updateRoleSidebar);
router.get('/roles/:roleName/sidebar', auth, isAdmin, roleController.getRoleSidebar);
router.get('/roles/:roleName/dashboard-config', auth, roleController.getDashboardConfigByRole);

// Permission routes
router.get('/permissions', auth, isAdmin, permissionController.getAllPermissions);
router.post('/permissions', auth, isAdmin, permissionController.createPermission);

module.exports = router;