const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true, trim: true },
  email:       { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash:{ type: String, required: true },
  role:        { type: String, enum: ['admin','customer'], default: 'customer' },
  createdAt:   { type: Date, default: Date.now }
});

// Virtual setter: when you do user.password = 'plain', it hashes before saving
userSchema.virtual('password')
  .set(function(pw) { this._password = pw; })
  .get(() => this._password);

userSchema.pre('save', async function(next) {
  if (this._password) {
    this.passwordHash = await bcrypt.hash(this._password, 10);
  }
  next();
});

userSchema.methods.checkPassword = pw => bcrypt.compare(pw, this.passwordHash);

module.exports = mongoose.model('User', userSchema);
