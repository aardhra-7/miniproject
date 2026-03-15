// Mock data for the application without database

const bcrypt = require('bcryptjs');

// Mock users with hashed passwords
const mockUsers = [
  {
    userId: 'admin001',
    password: bcrypt.hashSync('admin123', 10), // hashed password
    role: 'admin',
    name: 'Admin User',
    email: 'hridyamani123@gmail.com',
    phone: '1234567890',
    isActive: true,
    lastLogin: new Date()
  },
  {
    userId: 'student001',
    password: bcrypt.hashSync('student123', 10),
    role: 'student',
    name: 'John Doe',
    email: 'john@student.com',
    phone: '0987654321',
    isActive: true,
    lastLogin: new Date()
  },
  {
    userId: 'faculty001',
    password: bcrypt.hashSync('faculty123', 10),
    role: 'faculty',
    name: 'Dr. Smith',
    email: 'smith@faculty.com',
    phone: '1122334455',
    isActive: true,
    lastLogin: new Date()
  },
  {
    userId: 'authority001',
    password: bcrypt.hashSync('authority123', 10),
    role: 'authority',
    name: 'Authority User',
    email: 'authority@staysphere.com',
    phone: '5566778899',
    isActive: true,
    lastLogin: new Date()
  }
];

// Mock students data
const mockStudents = [
  {
    userId: 'student001',
    name: 'John Doe',
    rollNumber: 'CS001',
    department: 'Computer Science',
    year: 3,
    roomNumber: '101',
    wing: 'A',
    hostelBlock: 'Block 1',
    parentName: 'Jane Doe',
    parentPhone: '0987654321',
    address: '123 Main St',
    city: 'City',
    state: 'State',
    dateOfBirth: new Date('2000-01-01'),
    gender: 'Male',
    bloodGroup: 'O+',
    medicalInfo: 'None',
    email: 'john@student.com',
    phone: '0987654321',
    profileImage: '',
    admissionDate: new Date(),
    isActive: true
  }
];

// Mock attendance
const mockAttendance = [
  {
    studentId: 'student001',
    date: new Date(),
    status: 'present',
    markedBy: 'faculty001'
  }
];

// Mock outgoing requests
const mockOutgoing = [
  {
    studentId: 'student001',
    reason: 'Medical',
    destination: 'Hospital',
    expectedReturn: new Date(Date.now() + 24 * 60 * 60 * 1000),
    status: 'pending',
    requestedAt: new Date()
  }
];

// Mock home going
const mockHomeGoing = [
  {
    studentId: 'student001',
    reason: 'Family visit',
    expectedReturn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'approved',
    requestedAt: new Date()
  }
];

// Mock mess cut
const mockMessCut = [
  {
    studentId: 'student001',
    fromDate: new Date(),
    toDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    reason: 'Sick',
    status: 'approved',
    approvedBy: 'faculty001',
    approvedAt: new Date(),
    numberOfDays: 2
  }
];

// Mock notifications
const mockNotifications = [
  {
    userId: 'student001',
    title: 'Welcome',
    message: 'Welcome to StaySphere',
    type: 'info',
    isRead: false,
    createdAt: new Date()
  }
];

module.exports = {
  mockUsers,
  mockStudents,
  mockAttendance,
  mockOutgoing,
  mockHomeGoing,
  mockMessCut,
  mockNotifications
};