const mongoose = require('mongoose');

// MongoDB connection URL - using local MongoDB instance
const mongoURL = 'mongodb+srv://gym:gym123@gyms.6ug2q.mongodb.net/';

// Connect to MongoDB
const connectDB = () => {
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Successfully connected to MongoDB.'))
    .catch(err => console.error('Could not connect to MongoDB:', err));
}

module.exports = connectDB;
