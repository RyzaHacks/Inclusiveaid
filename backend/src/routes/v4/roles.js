const express = require('express');
const roleController = require('../../controllers/v4/roleController');
const permissionController = require('../../controllers/v4/permissionController');

const router = express.Router();

// Role routes
router.get('/', roleController.getAllRoles);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);
router.put('/:id/dashboard', roleController.updateRoleDashboard);
router.put('/:id/sidebar', roleController.updateRoleSidebar);

// Permission routes
router.get('/permissions', roleController.getAllPermissions);
router.put('/:id/permissions', permissionController.updateRolePermissions);

module.exports = router;