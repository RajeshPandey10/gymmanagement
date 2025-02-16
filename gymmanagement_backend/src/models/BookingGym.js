const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["gym"],
  },
  workoutType: {
    type: String,
    required: true,
    enum: ["exercise", "cardio"],
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  sessionDate: {
    type: Date,
    required: true,
  },
  payment: {
    method: {
      type: String,
      required: true,
      enum: ["khalti"],
    },
    transactionId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
