const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('student'));

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.get('/attendance', ctrl.getAttendance);
router.get('/mess-cuts', ctrl.getMessCuts);
router.post('/mess-cuts', ctrl.applyMessCut);
router.get('/outgoings', ctrl.getOutgoings);
router.post('/outgoings', ctrl.markOutgoing);
router.get('/home-goings', ctrl.getHomeGoings);
router.post('/home-goings', ctrl.markHomeGoing);
router.post('/mark-return', ctrl.markReturn);
router.get('/notifications', ctrl.getNotifications);

module.exports = router;
