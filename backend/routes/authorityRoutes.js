const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authorityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('authority'));

router.get('/summary', ctrl.getSummary);
router.get('/requests', ctrl.getPendingRequests);
router.put('/home-going/:id', ctrl.updateHomeGoing);
router.put('/mess-cut/:id', ctrl.updateMessCut);
router.post('/attendance', ctrl.markAttendance);
router.get('/students', ctrl.getStudents);
router.get('/faculty', ctrl.getFaculty);
router.get('/reports', ctrl.getReports);
router.post('/publish-notification', ctrl.publishNotification);
router.get('/notifications', ctrl.getNotifications);
router.delete('/notifications/:id', ctrl.deleteNotification);


module.exports = router;
