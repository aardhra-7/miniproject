const User = require('../models/User');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const Outgoing = require('../models/Outgoing');
const HomeGoing = require('../models/HomeGoing');
const Notification = require('../models/Notification');

// @desc    Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalStudents = await Student.countDocuments({ isActive: true });
    const pendingApprovals = await HomeGoing.countDocuments({ status: 'pending' }) +
      await MessCut.countDocuments({ status: 'pending' });
    const activeRequests = await Outgoing.countDocuments({ status: 'active' });
    const todayAttendance = await Attendance.countDocuments({
      date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        pendingApprovals,
        activeRequests,
        todayAttendance
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};
    if (role) query.role = role;
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { userId: { $regex: search, $options: 'i' } }
    ];
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create user
exports.createUser = async (req, res) => {
  try {
    const { userId, password, role, name, email, phone } = req.body;
    const exists = await User.findOne({ userId });
    if (exists) return res.status(400).json({ message: 'User ID already exists' });

    const user = new User({ userId, password, role, name, email, phone });
    await user.save();
    res.json({ success: true, message: 'User created', user: { userId: user.userId, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    delete updates.password;
    const user = await User.findOneAndUpdate({ userId: id }, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user status
exports.toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ userId: id });
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ userId: id });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get outgoing records
exports.getOutgoings = async (req, res) => {
  try {
    const outgoings = await Outgoing.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, outgoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get home going records
exports.getHomeGoings = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, homeGoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { date, studentId } = req.query;
    let query = {};
    if (date) query.date = { $gte: new Date(date), $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)) };
    if (studentId) query.studentId = studentId;
    const attendance = await Attendance.find(query).sort({ date: -1 }).limit(200);
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole, priority } = req.body;
    const notification = new Notification({
      title, message, type, targetRole, priority,
      sentBy: req.user.userId
    });
    await notification.save();
    res.json({ success: true, message: 'Notification sent', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all mess cuts
exports.getMessCuts = async (req, res) => {
  try {
    const messCuts = await MessCut.find().sort({ createdAt: -1 });
    res.json({ success: true, messCuts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject mess cut (admin)
exports.updateMessCut = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const messCut = await MessCut.findByIdAndUpdate(id, {
      status, remarks, approvedBy: req.user.userId, approvedAt: new Date()
    }, { new: true });
    res.json({ success: true, messCut });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
