// models/Employee.js
const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  f_Id: {
    type: String,
    required: true,
    unique: true,
  },
  f_Image: {
    type: String, // Store the image URL or file path
    required: true,
  },
  f_Name: {
    type: String,
    required: true,
  },
  f_Email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
  },
  f_Mobile: {
    type: String,
    required: true,
    match: [/^\d+$/, 'Mobile number must be numeric.'],
  },
  f_Designation: {
    type: String,
    required: true,
  },
  f_gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other'], // Optional: restrict gender values
  },
  f_Course: {
    type: String,
    required: true,
  },
  f_Createdate: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Employee', employeeSchema);
