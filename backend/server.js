const express = require('express');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authorityRoutes = require('./routes/authorityRoutes');

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/authority', authorityRoutes);

// ✅ Serve Angular
app.use(express.static(path.join(__dirname, 'dist')));

// Health check
app.get('/api', (req, res) => {
  res.json({ message: 'StaySphere API running' });
});

// ✅ Angular routing fix
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'server error', error: err.message });
});

const PORT = process.env.PORT || 5000; // 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
