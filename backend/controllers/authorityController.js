const User = require('../models/User');
const Attendance = require('../models/Attendance');
const MessCut = require('../models/MessCut');
const HomeGoing = require('../models/HomeGoing');
const Outgoing = require('../models/Outgoing');
const Notification = require('../models/Notification');

// Get pending requests (Only Home-going and Mess Cut)
exports.getPendingRequests = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find({ status: 'pending', recordingType: 'request' })
      .populate('student', 'name roomNumber')
      .sort({ createdAt: -1 });

    const messCuts = await MessCut.find({ status: 'pending' })
      .populate('student', 'name roomNumber')
      .sort({ createdAt: -1 });

    res.json({ success: true, homeGoings, messCuts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve/Reject requests
exports.updateHomeGoing = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const record = await HomeGoing.findByIdAndUpdate(id, {
      status, remarks, approvedBy: req.user._id, approvedAt: new Date()
    }, { new: true });

    if (record) {
      await Notification.create({
        user: record.student,
        title: 'Home-going Request Status',
        message: `Your home-going request for ${record.leaveDate.toLocaleDateString()} has been ${status}.`,
        type: 'request'
      });
    }

    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMessCut = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    const record = await MessCut.findByIdAndUpdate(id, {
      status, remarks, approvedBy: req.user._id, approvedAt: new Date()
    }, { new: true });

    if (record) {
      await Notification.create({
        user: record.student,
        title: 'Mess-cut Request Status',
        message: `Your mess-cut request from ${record.startDate.toLocaleDateString()} has been ${status}.`,
        type: 'request'
      });
    }

    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Marking Return Approval (If needed, but usually once returned it's completed)
// Currently outgoing is auto-verified if GPS matches.

// Mark attendance room-wise
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, date, status, remarks } = req.body;
    const student = await User.findById(studentId);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const existing = await Attendance.findOne({
      student: studentId,
      date: attendanceDate
    });

    if (existing) {
      existing.status = status;
      existing.remarks = remarks;
      existing.markedBy = req.user._id;
      existing.role = req.user.role;
      await existing.save();
      return res.json({ success: true, attendance: existing });
    }

    const attendance = new Attendance({
      student: studentId,
      studentName: student.name,
      admissionNo: student.admissionNo,
      roomNumber: student.roomNumber,
      date: attendanceDate,
      status,
      remarks,
      markedBy: req.user._id,
      role: req.user.role
    });

    await attendance.save();
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students for monitoring
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name roomNumber phone admissionNo semester collegeName hostelName')
      .sort({ roomNumber: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reports
exports.getReports = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      date: { $gte: startDate, $lte: endDate }
    }).populate('student', 'name roomNumber').sort({ date: 1, roomNumber: 1 });

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Notification Management
exports.publishNotification = async (req, res) => {
  try {
    const { title, message, targetRole, type } = req.body;
    const notification = new Notification({
      title,
      message,
      targetRole: targetRole || 'all',
      type: type || 'general',
      sender: req.user._id
    });
    await notification.save();
    res.json({ success: true, message: 'Announcement published successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
