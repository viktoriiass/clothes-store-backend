const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  passwordHash: String,
  resetToken: String,
  resetTokenExpiry: Date,
});

module.exports = mongoose.model('User', userSchema);
