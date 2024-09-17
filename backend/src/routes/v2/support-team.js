//routes/v2/support-team.js:
const express = require('express');
const router = express.Router();
const supportTeamController = require('../../controllers/v2/supportTeamController');
const { isAdmin, isAdminOrClient } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

router.get('/:clientId', auth, isAdminOrClient, supportTeamController.getSupportTeamForClient);
router.post('/:clientId', auth, isAdmin, supportTeamController.addSupportTeamMember);
router.put('/:clientId/:memberId', auth, isAdmin, supportTeamController.updateSupportTeamMember);
router.delete('/:clientId/:memberId', auth, isAdmin, supportTeamController.removeSupportTeamMember);

module.exports = router;