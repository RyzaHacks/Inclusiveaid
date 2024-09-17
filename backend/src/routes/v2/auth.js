//routes/v2/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../../controllers/v2/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;