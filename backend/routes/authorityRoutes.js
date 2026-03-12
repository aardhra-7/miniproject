const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authorityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('authority'));

router.get('/requests', ctrl.getPendingRequests);
router.patch('/home-goings/:id', ctrl.updateHomeGoing);
router.patch('/mess-cuts/:id', ctrl.updateMessCut);
router.post('/attendance', ctrl.markAttendance);
router.get('/attendance', ctrl.getAttendance);
router.get('/students', ctrl.getStudents);
router.post('/notifications', ctrl.sendNotification);
router.get('/reports', ctrl.getReports);

module.exports = router;
