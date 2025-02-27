// Load environment variables from .env file
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const { authLimiter, apiLimiter } = require("./middleware/rateLimiter");
const logger = require("./utils/logger");
const connectDB = require("./database/database");
const userRoutes = require("./routes/userRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const securityHeaders = require('./middleware/securityHeaders');
const app = express();
const port = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    exposedHeaders: ['Authorization']
}));

app.use(express.json()); // Built-in middleware to parse JSON
app.use(cookieParser()); // Use cookie parser middleware

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// Add security headers
app.use(securityHeaders);

// Routes
app.use("/api/user", userRoutes);
app.use("/api/trainers", trainerRoutes);
app.use('/api/bookings', bookingRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Default Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gym Management API" });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});

const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});