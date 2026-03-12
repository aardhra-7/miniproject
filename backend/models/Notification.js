const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['announcement', 'alert', 'notice', 'reminder'],
    default: 'announcement'
  },
  targetRole: {
    type: String,
    enum: ['all', 'student', 'faculty', 'authority', 'admin'],
    default: 'all'
  },
  targetUsers: [String],
  isRead: [String],
  sentBy: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
