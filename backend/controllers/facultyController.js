const User = require('../models/User');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const HomeGoing = require('../models/HomeGoing');
const Notification = require('../models/Notification');

// View profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Attendance Section 

exports.markSelfAttendance = async (req, res) => {
  try {
    const { status, date } = req.body;
    const attendanceDate = date ? new Date(date) : new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if already marked
    const existing = await Attendance.findOne({
      student: req.user._id,
      date: attendanceDate
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Attendance already marked for today.' });
    }

    const user = await User.findById(req.user._id);
    const attendance = new Attendance({
      student: req.user._id,
      studentName: user.name,
      date: attendanceDate,
      status,
      role: 'faculty',
      markedBy: req.user._id
    });

    await attendance.save();
    res.json({ success: true, message: 'Attendance marked', attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSelfAttendanceHistory = async (req, res) => {
  try {
    const history = await Attendance.find({ student: req.user._id }).sort({ date: -1 }).limit(30);
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Mess Cut Section

exports.requestMessCut = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const messCut = new MessCut({
      student: req.user._id,
      startDate,
      endDate,
      reason,
      status: 'pending'
    });
    await messCut.save();
    res.json({ success: true, message: 'Mess cut request submitted !! ', messCut });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSelfMessCuts = async (req, res) => {
  try {
    const history = await MessCut.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Home Going Section ---

exports.markHomeGoing = async (req, res) => {
  try {
    const { leaveDate, returnDate, reason, place } = req.body;
    const user = await User.findById(req.user._id);
    const entry = new HomeGoing({
      student: req.user._id,
      studentName: user.name,
      leaveDate,
      returnDate,
      reason,
      place,
      status: 'marked' // No approval required for faculty
    });
    await entry.save();
    res.json({ success: true, message: 'Home going recorded', entry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSelfHomeGoings = async (req, res) => {
  try {
    const history = await HomeGoing.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Notifications Section ---

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { targetRole: 'faculty' },
        { targetRole: 'all' }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
