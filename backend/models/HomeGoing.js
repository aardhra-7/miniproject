const mongoose = require('mongoose');

const homeGoingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: String,
  roomNumber: String,
  leaveDate: {
    type: Date,
    required: true
  },
  time: String,
  place: String,
  reason: String, // Kept for history though not strictly requested in form
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'returned'],
    default: 'pending'
  },
  isReturned: {
    type: Boolean,
    default: false
  },
  returnDate: Date,
  returnTime: String,
  recordingType: {
    type: String,
    enum: ['request', 'recording'],
    default: 'request'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeGoing', homeGoingSchema);
