// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const app = express();
const port = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Middleware

// server.js
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  exposedHeaders: ['Authorization']
}));

app.use(express.json()); // Built-in middleware to parse JSON
app.use(cookieParser()); // Use cookie parser middleware

// Routes
app.use("/api/user", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use('/api/bookings', bookingRoutes);

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gym Management API" });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});