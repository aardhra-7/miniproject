const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true, ref: 'Student' },
  studentName: String,
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave', 'outgoing'],
    required: true
  },
  markedBy: { type: String, ref: 'User' },
  remarks: String,
  session: {
    type: String,
    enum: ['morning', 'evening', 'night'],
    default: 'morning'
  }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
