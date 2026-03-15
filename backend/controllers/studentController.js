const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Outgoing = require('../models/Outgoing');
const HomeGoing = require('../models/HomeGoing');
const Notification = require('../models/Notification');

// Calculate distance between two GPS coordinates 
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.role;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark outgoing
exports.markOutgoing = async (req, res) => {
  try {
    const { date, timeLeaving, expectedReturnTime, reason, place } = req.body;

    const outgoing = new Outgoing({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      date: new Date(date),
      timeLeaving,
      expectedReturnTime,
      reason,
      place,
      status: 'pending'
    });

    await outgoing.save();
    res.json({ success: true, message: 'Outgoing request submitted', outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark home going
exports.markHomeGoing = async (req, res) => {
  try {
    const { date, time, place, reason } = req.body;

    const homeGoing = new HomeGoing({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      date: new Date(date),
      time,
      place,
      reason,
      status: 'marked' // No approval required
    });

    await homeGoing.save();
    res.json({ success: true, message: 'Home-going marked successfully', homeGoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark return
exports.markReturn = async (req, res) => {
  try {
    const { type, requestId, latitude, longitude, returnDate, returnTime } = req.body;

    const HOSTEL_LAT = parseFloat(process.env.HOSTEL_LAT || '9.4265');
    const HOSTEL_LON = parseFloat(process.env.HOSTEL_LON || '76.9246');
    const ALLOWED_RADIUS = 200; // 200m radius

    const distance = calculateDistance(latitude, longitude, HOSTEL_LAT, HOSTEL_LON);
    const isWithinPremises = distance <= ALLOWED_RADIUS;

    if (!isWithinPremises) {
      return res.status(400).json({
        success: false,
        message: 'You must be inside hostel premises to mark return.'
      });
    }

    let record;
    if (type === 'outgoing') {
      record = await Outgoing.findByIdAndUpdate(requestId, {
        returnTime: new Date(`${returnDate}T${returnTime}`),
        returnDate: new Date(returnDate),
        gpsLocation: { lat: latitude, lng: longitude },
        returnStatus: 'returned',
        status: 'returned',
        isGpsVerified: true
      }, { new: true });
    } else {
      record = await HomeGoing.findByIdAndUpdate(requestId, {
        returnDate: new Date(returnDate),
        status: 'returned'
      }, { new: true });
    }

    res.json({ success: true, message: 'Return marked successfully. Welcome back!', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get History
exports.getOutgoings = async (req, res) => {
  try {
    const outgoings = await Outgoing.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, outgoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHomeGoings = async (req, res) => {
  try {
    const homeGoings = await HomeGoing.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, homeGoings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id }).sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
