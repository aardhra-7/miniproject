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
        message: `Your home-going request for ${record.leaveDate.toLocaleDateString()} has been ${status}${remarks ? '. Remarks: ' + remarks : ''}.`,
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
        message: `Your mess-cut request from ${record.startDate.toLocaleDateString()} has been ${status}${remarks ? '. Remarks: ' + remarks : ''}.`,
        type: 'request'
      });
    }

    res.json({ success: true, record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark attendance (Supports Bulk)
exports.markAttendance = async (req, res) => {
  try {
    const { attendance, date } = req.body; // Expects array of { student, status, remarks }
    const markingDate = date ? new Date(date) : new Date();
    markingDate.setHours(0, 0, 0, 0);

    const results = [];
    for (const item of attendance) {
      const { student: studentId, status, remarks } = item;
      const student = await User.findById(studentId);
      if (!student) continue;

      let record = await Attendance.findOne({ student: studentId, date: markingDate });

      if (record) {
        record.status = status;
        record.remarks = remarks || '';
        record.markedBy = req.user._id;
        record.role = req.user.role;
      } else {
        record = new Attendance({
          student: studentId,
          studentName: student.name,
          admissionNo: student.admissionNo,
          roomNumber: student.roomNumber,
          date: markingDate,
          status,
          remarks: remarks || '',
          markedBy: req.user._id,
          role: req.user.role
        });
      }
      await record.save();
      results.push(record);
    }

    res.json({ success: true, message: 'Attendance processed', count: results.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students sorted by room
exports.getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('name roomNumber phone admissionNo semester collegeName hostelName userId email guardiansName guardiansPhone address')
      .sort({ roomNumber: 1 });
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get faculty
exports.getFaculty = async (req, res) => {
  try {
    const faculty = await User.find({ role: 'faculty' })
      .select('name department phone email designation roomNumber userId dob bloodGroup collegeName')
      .sort({ name: 1 });
    res.json({ success: true, faculty });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dashboard Summary
exports.getSummary = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [outgoings, homeGoings, activeMessCuts, pendingHomeGoings, pendingMessCuts] = await Promise.all([
      Outgoing.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
      HomeGoing.countDocuments({ leaveDate: { $gte: today, $lt: tomorrow }, recordingType: 'recording' }),
      MessCut.countDocuments({ startDate: { $lte: new Date() }, endDate: { $gte: new Date() }, status: 'approved' }),
      HomeGoing.countDocuments({ status: 'pending', recordingType: 'request' }),
      MessCut.countDocuments({ status: 'pending' })
    ]);

    res.json({
      success: true,
      summary: {
        todayOutgoings: outgoings,
        todayHomeGoings: homeGoings,
        activeMessCuts,
        pendingHomeGoings,
        pendingMessCuts
      }
    });
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
