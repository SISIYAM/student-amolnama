const { secondaryConnection } = require('../config/mongodbConnections'); // Adjust path as needed
const mongoose = require('mongoose');

const bindingSchema = new mongoose.Schema({
    exams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }] // Store bound exam IDs
});

module.exports = secondaryConnection.model('Binding', bindingSchema);