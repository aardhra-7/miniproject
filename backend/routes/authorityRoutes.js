const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authorityController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('authority'));

router.get('/requests', ctrl.getPendingRequests);
router.put('/home-going/:id', ctrl.updateHomeGoing);
router.put('/outgoing/:id', ctrl.updateOutgoing);
router.post('/attendance', ctrl.markAttendance);
router.get('/students', ctrl.getStudents);
router.get('/reports', ctrl.getReports);
router.post('/publish-notification', ctrl.publishNotification);

module.exports = router;
