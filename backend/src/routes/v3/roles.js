const express = require('express');
const router = express.Router();
const roleController = require('../../controllers/v3/roleController');
const auth = require('../../middleware/auth');


router.get('/', auth, roleController.getAllRoles);

// Route to fetch dashboard config by role
router.get('/:roleName/dashboard-config', auth, roleController.getDashboardConfigByRole);
router.get('/:roleName/sidebar', auth, roleController.getRoleSidebar);

module.exports = router;
