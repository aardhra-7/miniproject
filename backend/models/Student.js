const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    ref: 'User'
  },
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  department: String,
  year: { type: Number, enum: [1, 2, 3, 4] },
  roomNumber: String,
  wing: String,
  hostelBlock: String,
  parentName: String,
  parentPhone: String,
  address: String,
  city: String,
  state: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: String,
  medicalInfo: String,
  email: String,
  phone: String,
  profileImage: String,
  admissionDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
