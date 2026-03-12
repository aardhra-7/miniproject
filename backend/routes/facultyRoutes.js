const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('faculty'));

router.get('/profile', ctrl.getProfile);
router.get('/students', ctrl.getStudents);
router.post('/attendance', ctrl.markAttendance);
router.get('/mess-cuts', ctrl.getMessCuts);
router.get('/home-goings', ctrl.getHomeGoings);
router.get('/notifications', ctrl.getNotifications);

module.exports = router;
