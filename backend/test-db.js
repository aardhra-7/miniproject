const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing connection with URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ FAILURE: Connection failed.');
        console.error('Error Details:', err.message);
        process.exit(1);
    });
