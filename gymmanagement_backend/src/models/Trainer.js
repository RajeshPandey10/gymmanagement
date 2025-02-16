const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Trainer name is required'],
    trim: true
  },
  email: { type: String, required: true, unique: true },  
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: ['Weight Training', 'Yoga', 'Cardio', 'CrossFit', 'Nutrition','zumba']
  },
  experience: {
    type: Number,
    required: [true, 'Experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  rate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Rate cannot be negative']
  },
  availability: {
    days: [{
      type: String,
      enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }],
    hours: {
      start: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ },
      end: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
    }
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  rating: {
    type: Number,
    default: 4.5,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

trainerSchema.virtual('formattedRate').get(function() {
  return `₹${this.rate}/hour`;
});

module.exports = mongoose.model('Trainer', trainerSchema);