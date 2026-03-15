const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { mockUsers, mockStudents } = require('../mockData');

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        console.log('Existing users cleared.');

        // Seed Users (including Student data)
        const createdUsers = await User.insertMany(mockUsers);
        console.log(`${createdUsers.length} users seeded.`);

        // Add additional student details for the mock student
        const student = await User.findOne({ userId: 'student001' });
        if (student) {
            Object.assign(student, mockStudents[0]);
            await student.save();
            console.log('Updated student001 with detailed profile info.');
        }

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error.message);
        process.exit(1);
    }
};

seedDB();
