const express = require("express");
const Booking = require("../models/BookingGym");

const router = express.Router();

// POST: Create a new gym booking
router.post("/gym", async (req, res) => {
  try {
    const { type, workoutType, duration, sessionDate, payment } = req.body;

    // Validate request body
    if (!type || !workoutType || !duration || !sessionDate || !payment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Determine price based on workout type
    const price = workoutType === "cardio" ? duration * 250 : duration * 100;

    // Create booking
    const newBooking = new Booking({
      type,
      workoutType,
      duration,
      sessionDate,
      payment: {
        method: payment.method,
        transactionId: payment.transactionId,
        amount: price,
      },
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking successful", booking: newBooking });
  } catch (error) {
    res.status(500).json({ error: "Server error, please try again." });
  }
});

// GET: Retrieve all gym bookings
router.get("/gym", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
