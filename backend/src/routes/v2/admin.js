const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/v2/adminController');
const userController = require('../../controllers/v2/userController');
const serviceController = require('../../controllers/v2/serviceController');
const ndisPlanController = require('../../controllers/v2/ndisPlanController');
const appointmentController = require('../../controllers/v2/appointmentController');
const auth = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleMiddleware');

// Dashboard
router.get('/dashboard-stats', auth, isAdmin, adminController.getDashboardStats);

// User Management
router.get('/users', auth, isAdmin, userController.getAllUsers);
router.post('/users', auth, isAdmin, userController.createUser);
router.get('/users/:id', auth, isAdmin, userController.getUserById);
router.put('/users/:id', auth, isAdmin, userController.updateUser);
router.delete('/users/:id', auth, isAdmin, userController.deleteUser);

// Service Management
router.get('/services', auth, isAdmin, serviceController.getAllServices);
router.post('/services', auth, isAdmin, serviceController.createService);
router.get('/services/:id', auth, isAdmin, serviceController.getServiceById);
router.put('/services/:id', auth, isAdmin, serviceController.updateService);
router.delete('/services/:id', auth, isAdmin, serviceController.deleteService);

// NDIS Plan Management
router.get('/ndis-plans', auth, isAdmin, ndisPlanController.getAllNdisPlans);
router.get('/ndis-plans/:id', auth, isAdmin, ndisPlanController.getNdisPlanById);
router.put('/ndis-plans/:id', auth, isAdmin, ndisPlanController.updateNdisPlan);

// Appointment Management
router.get('/appointments', auth, isAdmin, appointmentController.getAllAppointments);
router.post('/appointments', auth, isAdmin, appointmentController.createAppointment);
router.get('/appointments/:id', auth, isAdmin, appointmentController.getAppointmentById);
router.put('/appointments/:id', auth, isAdmin, appointmentController.updateAppointment);
router.delete('/appointments/:id', auth, isAdmin, appointmentController.deleteAppointment);

// User Assignments
router.get('/user-assignments', auth, isAdmin, adminController.getUserAssignments);
router.post('/user-assignments', auth, isAdmin, adminController.createUserAssignment);
router.put('/user-assignments/:id', auth, isAdmin, adminController.updateUserAssignment);
router.delete('/user-assignments/:id', auth, isAdmin, adminController.deleteUserAssignment);

module.exports = router;