//routes/v2/users.js


const express = require('express');
const router = express.Router();
const userController = require('../../controllers/v2/userController');
const { isAdmin } = require('../../middleware/roleMiddleware');
const auth = require('../../middleware/auth');

router.get('/me', auth, userController.getMe);
router.put('/me', auth, userController.updateProfile);
router.get('/contacts', auth, userController.getContacts);

router.get('/', auth, isAdmin, userController.getAllUsers);
router.post('/', auth, isAdmin, userController.createUser);
router.put('/:id', auth, isAdmin, userController.updateUser);
router.delete('/:id', auth, isAdmin, userController.deleteUser);

module.exports = router;