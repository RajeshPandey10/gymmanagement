const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { signup, signin } = require('../controllers/userController');
const Booking = require('../models/BookingGym');
const User = require('../models/User');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
// Get user by ID
router.get('/user/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.name,
      email: user.email,
      phone: user.phoneNumber
    });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update phone number
router.put('/update-phone', authMiddleware, async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findById(req.user.id);
    user.phone = phone;
    await user.save();
    res.status(200).json({ message: 'Phone number updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.delete('/delete-account/:id', authMiddleware, async (req, res) => {
  const { id: userIdFromParam } = req.params; // Get the user ID from the route parameter
  const { id: userIdFromToken } = req.user; // Get the user ID from the JWT token

  console.log('Attempting to delete user with ID from param:', userIdFromParam); // Add a debug log
  console.log('User ID from token:', userIdFromToken); // Add a debug log

  // Ensure that the user is deleting their own account
  if (userIdFromParam !== userIdFromToken) {
    return res.status(403).json({ message: 'You can only delete your own account' });
  }

  try {
    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(userIdFromParam);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Error deleting account:', err); // Add a debug log
    res.status(500).json({ message: 'Error deleting account', error: err.message });
  }
});


router.get('/all', authMiddleware, async (req, res) => {
  try {
    // Optional: You can add a check to ensure the user has admin privileges
    if (req.user.role == 'admin') {
      return res.status(403).json({ message: 'Access denied, admin only' });
    }

    const users = await User.find().select('-password'); // Exclude password from user data
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});



// Get current user route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    // Ensure req.user.id is set
    console.log("User ID from token:", req.user.id);

    const user = await User.findById(req.user.id).select('-password');
    
    // Log the user data for debugging
    console.log("User found:", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      username: user.name,  // Ensure this field is correct
      email: user.email,
      phone: user.phoneNumber // Correct field name
    });
  } catch (error) {
    // Log error details for debugging
    console.error("Error fetching user:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Unified transactions endpoint
router.get('/transactions', authMiddleware, async (req, res) => {
  try {
    const transactions = await Booking.find({ user: req.user.id })
      .sort('-createdAt')
      .lean(); // Retrieve transactions for the logged-in user, sorted by createdAt

    const formatted = transactions.map(t => {
      let description = '';
      let icon = '';
      let amount = t.amount || 0;
      let paymentStatus = t.paymentStatus || 'pending';

      // Handle gym sessions
      if (t.type === 'gym') {
        description = `${t.duration}h ${t.workoutType} Session`;
        icon = '🏋️'; // Gym icon
        amount = t.payment?.amount || 0; // Ensure payment amount is used
        paymentStatus = t.payment?.status || 'pending';
      } 
      
      // Handle trainer sessions
      if (t.type === 'trainer') {
        description = `Training with ${t.trainer.name}`;
        icon = '👨🏫'; // Trainer icon
        amount = t.amount || 0;
        paymentStatus = t.paymentStatus || 'pending';
      }

      return {
        ...t,
        description,
        icon,
        amount,
        paymentStatus,
        date: t.createdAt,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});


module.exports = router;