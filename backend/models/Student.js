const { mockStudents } = require('../mockData');

// Mock Student model
const Student = {
  findOne: async (query) => {
    return mockStudents.find(student => student.userId === query.userId);
  },

  find: async (query) => {
    return mockStudents;
  },

  create: async (data) => {
    const newStudent = { ...data, admissionDate: new Date(), isActive: true };
    mockStudents.push(newStudent);
    return newStudent;
  },

  findByIdAndUpdate: async (id, updates) => {
    const student = mockStudents.find(s => s._id === id || s.userId === id);
    if (student) {
      Object.assign(student, updates);
      return student;
    }
    return null;
  },

  findByIdAndDelete: async (id) => {
    const index = mockStudents.findIndex(s => s._id === id || s.userId === id);
    if (index > -1) {
      return mockStudents.splice(index, 1)[0];
    }
    return null;
  }
};

module.exports = Student;
