const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Outgoing = require('../models/Outgoing');
const HomeGoing = require('../models/HomeGoing');
const MessCut = require('../models/MessCut');
const Notification = require('../models/Notification');
const HostelSettings = require('../models/HostelSettings');

// Calculate distance between  GPS coordinates 
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
    const now = new Date();
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const outgoing = new Outgoing({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      date: date ? new Date(date) : now,
      timeLeaving: timeLeaving || currentTime,
      place,
      status: 'active'
    });

    await outgoing.save();
    res.json({ success: true, message: 'Outgoing marked successfully', outgoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request home going 
exports.requestHomeGoing = async (req, res) => {
  try {
    const { leaveDate, time, place } = req.body;

    const homeGoing = new HomeGoing({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      leaveDate: new Date(leaveDate),
      time,
      place,
      recordingType: 'request',
      status: 'pending'
    });

    await homeGoing.save();
    res.json({ success: true, message: 'Home-going request submitted', homeGoing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark home going 
exports.markHomeGoing = async (req, res) => {
  try {
    const { leaveDate, time, place } = req.body;

    const homeGoing = new HomeGoing({
      student: req.user._id,
      studentName: req.user.name,
      roomNumber: req.user.roomNumber,
      leaveDate: new Date(leaveDate),
      time,
      place,
      recordingType: 'recording',
      status: 'active'
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
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    // Get hostel settings 
    const settings = await HostelSettings.findOne({ hostelName: req.user.hostelName });

    // Precise coordinate retrieval
    const HOSTEL_LAT = settings?.locationCoordinates?.latitude !== undefined ? settings.locationCoordinates.latitude : parseFloat(process.env.HOSTEL_LAT || '9.4265');
    const HOSTEL_LON = settings?.locationCoordinates?.longitude !== undefined ? settings.locationCoordinates.longitude : parseFloat(process.env.HOSTEL_LON || '76.9246');
    const ALLOWED_RADIUS = settings?.returnRadius || 200;

    const distance = calculateDistance(latitude, longitude, HOSTEL_LAT, HOSTEL_LON);
    const isWithinPremises = distance <= ALLOWED_RADIUS;

    if (!isWithinPremises) {
      return res.status(400).json({
        success: false,
        message: `Geofence Violation: You are ${distance.toFixed(0)}m away. Required within ${ALLOWED_RADIUS}m of hostel. (Configured Hostel Location: ${HOSTEL_LAT}, ${HOSTEL_LON})`
      });
    }

    let record;
    if (type === 'outgoing') {
      record = await Outgoing.findByIdAndUpdate(requestId, {
        returnTime: returnTime || currentTime,
        returnDate: returnDate ? new Date(returnDate) : now,
        gpsLocation: { lat: latitude, lng: longitude },
        status: 'returned',
        isReturned: true,
        isGpsVerified: true
      }, { new: true });
    } else {
      record = await HomeGoing.findByIdAndUpdate(requestId, {
        returnDate: returnDate ? new Date(returnDate) : now,
        returnTime: returnTime || currentTime,
        status: 'returned',
        isReturned: true
      }, { new: true });
    }

    if (!record) return res.status(404).json({ message: 'Record not found' });

    res.json({ success: true, message: 'Return marked successfully. Welcome back!', record });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mess Cut Request
exports.requestMessCut = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    // Validation: Start date must be at least tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    if (start < tomorrow) {
      return res.status(400).json({ message: 'Mess cut can only start from tomorrow onwards.' });
    }

    // Validation: Minimum days check from HostelSettings
    const settings = await HostelSettings.findOne({ hostelName: req.user.hostelName });
    const minDays = settings?.minMessCutDays || 3;

    const diffTime = Math.abs(new Date(endDate) - new Date(startDate));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays < minDays) {
      return res.status(400).json({ message: `Mess cut must be for at least ${minDays} days.` });
    }

    const messCut = new MessCut({
      student: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: 'pending'
    });

    await messCut.save();
    res.json({ success: true, message: 'Mess cut request submitted successfully', messCut });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMessCuts = async (req, res) => {
  try {
    const messCuts = await MessCut.find({ student: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, messCuts });
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
    // Return notifications
    const notifications = await Notification.find({
      $or: [
        { user: req.user._id },
        { targetRole: { $in: ['all', 'student'] } }
      ]
    }).sort({ createdAt: -1 }).limit(30);

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
