const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generateToken, setTokenCookie } = require("../services/auth");

const signup = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    // Validate inputs
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: "Name should only contain letters and spaces." });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: "Phone number must be 10 digits." });
    }

    // Check for existing user
    const existingUser  = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser ) {
      return res.status(400).json({ message: "User  already exists with this email or phone number." });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser  = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser .save();

    // Generate token for automatic login
    const token = generateToken(newUser );
    setTokenCookie(res, token);

    res.status(201).json({
      message: "Registration successful",
      user: { id: newUser ._id, name: newUser .name, email: newUser .email },
      token // Send token in response body
    });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Registration failed. Please try again." });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);
    setTokenCookie(res, token);

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token // Send token in response body
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};

const getCurrentUser  = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User  not found' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber,
    });
  } catch (error) {
    console.error('User  profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { signup, signin, getCurrentUser  };