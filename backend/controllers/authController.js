const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'staysphere_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Login user
exports.login = async (req, res) => {
  try {
    const { userId, password, role } = req.body;

    if (!userId || !password || !role) {
      return res.status(400).json({ message: 'Please provide userId, password and role' });
    }

    const user = await User.findOne({ userId, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Contact admin.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    let profileData = null;
    if (role === 'student') {
      profileData = await Student.findOne({ userId });
    }

    const token = generateToken(user.userId, user.role);

    res.json({
      success: true,
      token,
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage
      },
      profile: profileData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

//  Get current user
exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

//   Seed initial users
exports.seedUsers = async (req, res) => {
  try {
    const existingAdmin = await User.findOne({ userId: 'ADM-001' });
    if (existingAdmin) {
      return res.json({ message: 'Users already seeded' });
    }

    const users = [
      { userId: 'STU-2023-033', password: 'Flower@13', role: 'student', name: 'Aardhra Karthik', email: 'aardhra@student.edu', phone: '9876543210' },
      { userId: 'STU-2023-034', password: 'student123', role: 'student', name: 'Rahul Menon', email: 'rahul@student.edu', phone: '9876543211' },
      { userId: 'STU-2023-035', password: 'student123', role: 'student', name: 'Priya Nair', email: 'priya@student.edu', phone: '9876543212' },
      { userId: 'FAC-2024-010', password: 'faculty123', role: 'faculty', name: 'Dr. Rajan Kumar', email: 'rajan@faculty.edu', phone: '9876543220' },
      { userId: 'FAC-2024-011', password: 'faculty123', role: 'faculty', name: 'Prof. Anitha Suresh', email: 'anitha@faculty.edu', phone: '9876543221' },
      { userId: 'ADM-001', password: 'admin123', role: 'admin', name: 'System Administrator', email: 'admin@staysphere.edu', phone: '9876543200' },
      { userId: 'AUTH-001', password: 'authority123', role: 'authority', name: 'Warden Sreeja Mohan', email: 'warden@staysphere.edu', phone: '9876543230' },
      { userId: 'AUTH-002', password: 'authority123', role: 'authority', name: 'Wing Secretary Ajith Kumar', email: 'wingsec@staysphere.edu', phone: '9876543231' }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
    }

    // Seed student profiles
    const students = [
      { userId: 'STU-2023-033', name: 'Aardhra Karthik', rollNumber: '21CS033', department: 'Computer Science', year: 3, roomNumber: '204', wing: 'A', hostelBlock: 'Block 1', parentName: 'Karthik Mohan', parentPhone: '9845123456', gender: 'Female', bloodGroup: 'B+', city: 'Punalur', state: 'Kerala' },
      { userId: 'STU-2023-034', name: 'Rahul Menon', rollNumber: '21ME034', department: 'Mechanical Engineering', year: 3, roomNumber: '305', wing: 'B', hostelBlock: 'Block 2', parentName: 'Suresh Menon', parentPhone: '9845123457', gender: 'Male', bloodGroup: 'O+', city: 'Kochi', state: 'Kerala' },
      { userId: 'STU-2023-035', name: 'Priya Nair', rollNumber: '21EC035', department: 'Electronics', year: 3, roomNumber: '112', wing: 'A', hostelBlock: 'Block 1', parentName: 'Vijayan Nair', parentPhone: '9845123458', gender: 'Female', bloodGroup: 'A+', city: 'Thiruvananthapuram', state: 'Kerala' }
    ];

    for (const studentData of students) {
      const student = new Student(studentData);
      await student.save();
    }

    res.json({ success: true, message: 'Users seeded successfully', count: users.length });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ message: 'Seed error', error: error.message });
  }
};
