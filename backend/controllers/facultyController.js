const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const HomeGoing = require('../models/HomeGoing');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get faculty profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).sort({ name: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, session } = req.body;
    const student = await Student.findOne({ userId: studentId });

    const attendance = new Attendance({
      studentId,
      studentName: student?.name || studentId,
      date: new Date(date),
      status,
      session: session || 'morning',
      markedBy: req.user.userId
    });
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mess cut requests
exports.getMessCuts = async (req, res) => {
  try {
    const messCuts = await MessCut.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, messCuts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get home going requests
exports.getHomeGoings = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find().sort({ createdAt: -1 });
    res.json({ success: true, homeGoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [{ targetRole: 'all' }, { targetRole: 'faculty' }]
    }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
