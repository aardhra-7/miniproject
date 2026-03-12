const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const Outgoing = require('../models/Outgoing');
const HomeGoing = require('../models/HomeGoing');
const Notification = require('../models/Notification');

// Calculate distance between two GPS coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// @desc    Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.userId });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const { phone, address, city, state, medicalInfo } = req.body;
    const student = await Student.findOneAndUpdate(
      { userId: req.user.userId },
      { phone, address, city, state, medicalInfo },
      { new: true }
    );
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance
exports.getAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()), 1);
    const endDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth()) + 1, 0);

    const attendance = await Attendance.find({
      studentId: req.user.userId,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: 1 });

    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.json({ success: true, attendance, totalDays, presentDays, percentage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Apply mess cut
exports.applyMessCut = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;
    const student = await Student.findOne({ userId: req.user.userId });

    const from = new Date(fromDate);
    const to = new Date(toDate);
    const days = Math.ceil((to - from) / (1000 * 60 * 60 * 24)) + 1;

    const messCut = new MessCut({
      studentId: req.user.userId,
      studentName: student?.name || req.user.userId,
      fromDate: from,
      toDate: to,
      reason,
      numberOfDays: days
    });
    await messCut.save();
    res.json({ success: true, message: 'Mess cut request submitted', messCut });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mess cut requests
exports.getMessCuts = async (req, res) => {
  try {
    const messCuts = await MessCut.find({ studentId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, messCuts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark outgoing
exports.markOutgoing = async (req, res) => {
  try {
    const { reason, expectedReturnTime, latitude, longitude } = req.body;
    const student = await Student.findOne({ userId: req.user.userId });

    const outgoing = new Outgoing({
      studentId: req.user.userId,
      studentName: student?.name || req.user.userId,
      reason,
      expectedReturnTime: new Date(expectedReturnTime),
      latitude,
      longitude,
      timestamp: new Date()
    });
    await outgoing.save();
    res.json({ success: true, message: 'Outgoing marked successfully', outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark home going
exports.markHomeGoing = async (req, res) => {
  try {
    const { fromDate, toDate, reason, latitude, longitude } = req.body;
    const student = await Student.findOne({ userId: req.user.userId });

    const homeGoing = new HomeGoing({
      studentId: req.user.userId,
      studentName: student?.name || req.user.userId,
      fromDate: new Date(fromDate),
      toDate: new Date(toDate),
      reason,
      latitude,
      longitude,
      timestamp: new Date()
    });
    await homeGoing.save();
    res.json({ success: true, message: 'Home going request submitted', homeGoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark return to hostel
exports.markReturn = async (req, res) => {
  try {
    const { type, requestId, latitude, longitude } = req.body;

    const HOSTEL_LAT = parseFloat(process.env.HOSTEL_LATITUDE) || 8.8932;
    const HOSTEL_LON = parseFloat(process.env.HOSTEL_LONGITUDE) || 76.6141;
    const ALLOWED_RADIUS = parseFloat(process.env.HOSTEL_RADIUS) || 100;

    const distance = calculateDistance(latitude, longitude, HOSTEL_LAT, HOSTEL_LON);
    const isValid = distance <= ALLOWED_RADIUS;
    const returnStatus = isValid ? 'valid_return' : 'invalid_return';

    let record;
    if (type === 'outgoing') {
      record = await Outgoing.findByIdAndUpdate(requestId, {
        returnLatitude: latitude,
        returnLongitude: longitude,
        returnTimestamp: new Date(),
        returnStatus,
        status: isValid ? 'returned' : 'active'
      }, { new: true });
    } else {
      record = await HomeGoing.findByIdAndUpdate(requestId, {
        returnLatitude: latitude,
        returnLongitude: longitude,
        returnTimestamp: new Date(),
        returnStatus,
        status: isValid ? 'completed' : 'approved'
      }, { new: true });
    }

    if (!record) return res.status(404).json({ message: 'Request not found' });

    res.json({
      success: true,
      isValid,
      returnStatus,
      distance: Math.round(distance),
      message: isValid ? 'Return marked successfully! Welcome back.' : `Location mismatch. You must be inside hostel to mark return. Distance: ${Math.round(distance)}m`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get outgoing history
exports.getOutgoings = async (req, res) => {
  try {
    const outgoings = await Outgoing.find({ studentId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, outgoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get home going history
exports.getHomeGoings = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find({ studentId: req.user.userId }).sort({ createdAt: -1 });
    res.json({ success: true, homeGoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { targetRole: 'all' },
        { targetRole: 'student' },
        { targetUsers: req.user.userId }
      ],
      isActive: true
    }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
