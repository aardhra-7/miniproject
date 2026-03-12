const mongoose = require('mongoose');

const outgoingSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: String,
  reason: { type: String, required: true },
  expectedReturnTime: { type: Date, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
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
    enum: ['active', 'returned', 'overdue'],
    default: 'active'
  },
  approvedBy: String
}, { timestamps: true });

module.exports = mongoose.model('Outgoing', outgoingSchema);
