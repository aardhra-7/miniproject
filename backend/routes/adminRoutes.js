const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', ctrl.getDashboardStats);
router.get('/users', ctrl.getAllUsers);
router.post('/users', ctrl.createUser);
router.put('/users/:id', ctrl.updateUser);
router.patch('/users/:id/toggle', ctrl.toggleUserStatus);
router.delete('/users/:id', ctrl.deleteUser);
router.get('/students', ctrl.getAllStudents);
router.get('/outgoings', ctrl.getOutgoings);
router.get('/home-goings', ctrl.getHomeGoings);
router.get('/attendance', ctrl.getAttendance);
router.get('/mess-cuts', ctrl.getMessCuts);
router.patch('/mess-cuts/:id', ctrl.updateMessCut);
router.post('/notifications', ctrl.sendNotification);

module.exports = router;
