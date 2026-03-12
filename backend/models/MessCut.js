const mongoose = require('mongoose');

const messCutSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  studentName: String,
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: String,
  approvedAt: Date,
  remarks: String,
  numberOfDays: Number
}, { timestamps: true });

module.exports = mongoose.model('MessCut', messCutSchema);
