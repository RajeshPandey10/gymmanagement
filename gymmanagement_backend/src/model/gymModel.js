const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
      trim: true
  },
  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
  },
  password: {
      type: String,
      required: true
  },
 
  createdAt: {
      type: Date,
      default: Date.now
  }
});

// Create User model
const Gym = mongoose.model('Gym', userSchema);

module.exports = Gym;