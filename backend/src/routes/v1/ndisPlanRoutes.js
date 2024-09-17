// ndisPlanRoutes.js
const express = require('express');
const router = express.Router();
const ndisPlanController = require('../../controllers/v1/ndisPlanController');
const auth = require('../../middleware/auth');
const { isClient } = require('../../middleware/roleMiddleware');

router.use(auth);

router.get('/', isClient, ndisPlanController.getNDISPlan);
router.put('/', isClient, ndisPlanController.updateNDISPlan);

module.exports = router;