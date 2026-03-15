const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.get('/attendance', ctrl.getAttendance);
router.get('/outgoing', ctrl.getOutgoings);
router.post('/outgoing', ctrl.markOutgoing);
router.get('/home-going', ctrl.getHomeGoings);
router.post('/home-going', ctrl.markHomeGoing);
router.post('/return', ctrl.markReturn);
router.get('/notifications', ctrl.getNotifications);

module.exports = router;
