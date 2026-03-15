const mongoose = require('mongoose');

const outgoingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: String,
  roomNumber: String,
  date: {
    type: Date,
    default: Date.now
  },
  timeLeaving: String,
  expectedReturnTime: String,
  reason: String,
  place: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned'],
    default: 'pending'
  },
  returnTime: Date,
  returnDate: Date,
  returnStatus: {
    type: String,
    enum: ['not-returned', 'returned'],
    default: 'not-returned'
  },
  gpsLocation: {
    lat: Number,
    lng: Number
  },
  isGpsVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Outgoing', outgoingSchema);
