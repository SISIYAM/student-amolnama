const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Primary MongoDB connection
const primaryConnection = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

primaryConnection.once('open', () => {
  console.log('Primary MongoDB connected');
}).on('error', (err) => {
  console.log('Primary MongoDB connection error:', err);
});

// Secondary MongoDB connection
const secondaryConnection = mongoose.createConnection(process.env.MONGO_URI_SECOND, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

secondaryConnection.once('open', () => {
  console.log('Secondary MongoDB connected');
}).on('error', (err) => {
  console.log('Secondary MongoDB connection error:', err);
});

// Export both connections
module.exports = {
  primaryConnection,
  secondaryConnection,
};
