const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGODB_URI;
        if (!mongoURL) {
            throw new Error('MongoDB connection URL is not defined');
        }

        const conn = await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
