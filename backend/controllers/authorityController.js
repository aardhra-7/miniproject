const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const HomeGoing = require('../models/HomeGoing');
const Outgoing = require('../models/Outgoing');
const Notification = require('../models/Notification');

// @desc    Get pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find({ status: 'pending' }).sort({ createdAt: -1 });
    const messCuts = await MessCut.find({ status: 'pending' }).sort({ createdAt: -1 });
    const outgoings = await Outgoing.find({ status: 'active' }).sort({ createdAt: -1 });
    res.json({ success: true, homeGoings, messCuts, outgoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject home going
exports.updateHomeGoing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const record = await HomeGoing.findByIdAndUpdate(id, {
      status, remarks, approvedBy: req.user.userId, approvedAt: new Date()
    }, { new: true });
    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject mess cut
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

// @desc    Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, session, remarks } = req.body;
    const student = await Student.findOne({ userId: studentId });

    const existing = await Attendance.findOne({
      studentId, date: new Date(date), session: session || 'morning'
    });
    if (existing) {
      existing.status = status;
      existing.remarks = remarks;
      existing.markedBy = req.user.userId;
      await existing.save();
      return res.json({ success: true, attendance: existing });
    }

    const attendance = new Attendance({
      studentId,
      studentName: student?.name || studentId,
      date: new Date(date),
      status,
      session: session || 'morning',
      remarks,
      markedBy: req.user.userId
    });
    await attendance.save();
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance by date/wing
exports.getAttendance = async (req, res) => {
  try {
    const { date, wing } = req.query;
    let query = {};
    if (date) {
      const d = new Date(date);
      query.date = { $gte: d, $lt: new Date(d.setDate(d.getDate() + 1)) };
    }
    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students for monitoring
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ name: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type, targetRole, priority } = req.body;
    const notification = new Notification({
      title, message, type: type || 'announcement',
      targetRole: targetRole || 'student',
      priority: priority || 'medium',
      sentBy: req.user.userId
    });
    await notification.save();
    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reports
exports.getReports = async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from) : new Date(new Date().setDate(1));
    const endDate = to ? new Date(to) : new Date();

    const homeGoings = await HomeGoing.find({ createdAt: { $gte: startDate, $lte: endDate } });
    const outgoings = await Outgoing.find({ createdAt: { $gte: startDate, $lte: endDate } });
    const messCuts = await MessCut.find({ createdAt: { $gte: startDate, $lte: endDate } });
    const attendance = await Attendance.find({ date: { $gte: startDate, $lte: endDate } });

    res.json({
      success: true,
      reports: { homeGoings, outgoings, messCuts, attendance },
      summary: {
        totalHomeGoings: homeGoings.length,
        approvedHomeGoings: homeGoings.filter(h => h.status === 'approved').length,
        totalOutgoings: outgoings.length,
        totalMessCuts: messCuts.length,
        approvedMessCuts: messCuts.filter(m => m.status === 'approved').length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
