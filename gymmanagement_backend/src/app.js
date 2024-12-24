const express = require("express");
const cors = require("cors");
const Gym = require("./model/gymModel"); // Updated import path
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const connectDB = require("./database/database");

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
}));

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to GymManagement API" });
});

// Sign up route
app.post("/api/signup", async (req, res) => {
  try {
    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database connection error" });
    }

    const { name, email, password } = req.body;

    // Check if user already exists with timeout
    const existingUser = await Gym.findOne({ email: email }).maxTimeMS(5000).exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new Gym({
      name,
      email,
      password: hashedPassword,
    });

    // Save user with timeout using Promise.race
    const savePromise = user.save();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Save operation timed out')), 5000);
    });

    await Promise.race([savePromise, timeoutPromise]);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res
      .status(500)
      .json({ 
        message: "Error creating user", 
        error: error.message,
        details: "Database operation timed out. Please try again."
      });
  }
});

// Sign in route
app.post("/api/signin", async (req, res) => {
  try {
    // Check MongoDB connection first
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({ message: "Database connection error" });
    }

    const { email, password } = req.body;

    // Find user with timeout
    const user = await Gym.findOne({ email: email }).maxTimeMS(5000).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Return user data (excluding password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Signin error:", error);
    res
      .status(500)
      .json({ 
        message: "Error during login", 
        error: error.message,
        details: "Database operation timed out. Please try again."
      });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
