const mongoose = require('mongoose');

const homeGoingSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: String,
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  returnLatitude: Number,
  returnLongitude: Number,
  returnTimestamp: Date,
  returnStatus: {
    type: String,
    enum: ['pending', 'valid_return', 'invalid_return', 'not_returned'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  approvedBy: String,
  approvedAt: Date,
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('HomeGoing', homeGoingSchema);
