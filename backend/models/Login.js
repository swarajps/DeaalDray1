const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  f_sno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // References the Employee model
  },
  f_userName: {
    type: String,
    required: true,
  },
  f_Pwd: {
    type: String,
    required: true,
  },
});

const Login = mongoose.model('Login', loginSchema);
module.exports = Login;
