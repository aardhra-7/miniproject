const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 10s
      connectTimeoutMS: 30000,
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(` MongoDB Connected`);
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
