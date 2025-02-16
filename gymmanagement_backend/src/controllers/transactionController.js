const Booking = require("../models/BookingGym");

const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Booking.find({ user: req.user.id }).sort('-createdAt').lean();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions" });
  }
};

module.exports = { getUserTransactions };