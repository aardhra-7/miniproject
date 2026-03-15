const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const HostelSettings = require('../models/HostelSettings');

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

    user.lastLogin = new Date();
    await user.save();

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
        hostelName: user.hostelName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Registration 
exports.registerAdmin = async (req, res) => {
  try {
    const { userId, password, name, email, phone, hostelName } = req.body;

    if (!hostelName) {
      return res.status(400).json({ message: 'Hostel Name is required for admin registration' });
    }

    // Check if an admin already exists for this hostel
    const existingAdmin = await User.findOne({ role: 'admin', hostelName });
    if (existingAdmin) {
      return res.status(400).json({ message: `An admin already exists for hostel "${hostelName}". Only that admin can transfer the role.` });
    }

    const userExists = await User.findOne({ $or: [{ userId }, { email }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with this ID or Email already exists' });
    }

    const user = await User.create({
      userId,
      password,
      name,
      email,
      phone,
      role: 'admin',
      hostelName
    });

    // default hostel settings
    await HostelSettings.create({
      hostelName,
      admin: user._id,
      locationCoordinates: { latitude: 0, longitude: 0 },
      returnRadius: 100,
      minMessCutDays: 3
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      user: { userId: user.userId, role: user.role, hostelName }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

    await user.save();

    // Create reset password url
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h1>Password Reset Request</h1>
      <p>Please click on the link below to reset your password:</p>
      <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
      <p>This link will expire in 30 minutes.</p>
    `;

    try {
      const sendEmail = require('../utils/sendEmail');
      await sendEmail({
        email: user.email,
        subject: 'StaySphere - Password Reset',
        html: message
      });

      res.json({
        success: true,
        message: 'Reset link sent to email'
      });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      console.error('Email error:', err);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.user.userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
