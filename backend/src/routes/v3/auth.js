//inclusive-aid\backend\src\routes\v3\auth.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v3/authController');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authController.getMe);

module.exports = router;
