const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');
const Booking = require('../models/BookingGym');
const BookingTrainer = require('../models/BookingTrainer'); 
const authMiddleware = require('../middleware/authMiddleware');


router.post('/create',async (req, res) => {
  try {
    const trainer = new Trainer({
      name: req.body.name,
      email: req.body.email,
      specialization: req.body.specialization,
      experience: req.body.experience,
      rate: req.body.rate,
      availability: req.body.availability,
      bio: req.body.bio
    });

    await trainer.save();
    
    res.status(201).json({
      message: 'Trainer created successfully',
      trainer: {
        id: trainer._id,
        name: trainer.name,
        specialization: trainer.specialization,
        rate: trainer.rate
      }
    });
  } catch (error) {
    res.status(400).json({ 
      message: 'Error creating trainer',
      error: error.message 
    });
  }
});
// Delete a trainer by ID
router.delete('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    await trainer.remove();
    res.status(200).json({ message: 'Trainer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer', error: error.message });
  }
});

// Delete all trainers
router.delete('/', async (req, res) => {
  try {
    await Trainer.deleteMany();
    res.status(200).json({ message: 'All trainers deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainers', error: error.message });
  }
});


// Get all trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find().select('-__v');
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers', error: error.message });
  }
});


// Book a trainer route (enhanced validation)
router.post('/:id/book', authMiddleware, async (req, res) => {
  try {
    // Validate trainer exists
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // Validate request body
    const { duration, sessionDate } = req.body;
    
    // Validation checks
    if (!duration || !sessionDate) {
      return res.status(400).json({ message: 'Duration and session date are required' });
    }

    if (typeof duration !== 'number' || duration < 1 || duration > 8) {
      return res.status(400).json({ message: 'Invalid duration (1-8 hours allowed)' });
    }

    const bookingDate = new Date(sessionDate);
    if (isNaN(bookingDate.getTime()) || bookingDate < new Date()) {
      return res.status(400).json({ message: 'Invalid session date' });
    }

    // Create booking using BookingTrainer model
    const booking = new BookingTrainer({
      user: req.user.id,
      trainer: trainer._id,
      duration,
      sessionDate: bookingDate,
      amount: trainer.rate * duration
    });

    await booking.save();

    // Populate trainer details for response
    const populatedBooking = await BookingTrainer.findById(booking._id)
      .populate('trainer', 'name rate')
      .populate('user', 'name email')
      .lean();

    // Remove sensitive fields
    delete populatedBooking.__v;
    delete populatedBooking.user._id;
    delete populatedBooking.trainer._id;

    res.status(201).json({
      message: 'Booking created successfully',
      booking: populatedBooking
    });

  } catch (error) {
    console.error('Booking error:', error);
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({
      message: 'Booking failed',
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});
router.patch('/bookings/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await BookingTrainer.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});


module.exports = router;