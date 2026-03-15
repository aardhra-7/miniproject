const mongoose = require('mongoose');

const homeGoingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: String,
  roomNumber: String,
  reason: String,
  leaveDate: Date,
  returnDate: Date,
  time: String,
  place: String,
  // No approval required according to requirements
  status: {
    type: String,
    default: 'marked'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeGoing', homeGoingSchema);
