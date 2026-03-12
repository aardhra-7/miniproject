const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout after 30s instead of 10s
      connectTimeoutMS: 30000,
    };
    const conn = await mongoose.connect(process.env.MONGODB_URI, options);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);

    if (error.message.includes('timeout') || error.message.includes('connect')) {
      console.log('⚠️  POSSIBLE CAUSE: Your network may be blocking port 27017 (standard for MongoDB).');
      console.log('   Try switching to a Mobile Hotspot to confirm.');
    }

    console.log('💡 TIP: Go to MongoDB Atlas -> Network Access and ensure "0.0.0.0/0" is added to allow access from any network.');
    process.exit(1);
  }
};

connectDB();

module.exports = connectDB;
