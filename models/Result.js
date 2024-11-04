const { secondaryConnection } = require('../config/mongodbConnections'); // Adjust path as needed
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the result
const ResultSchema = new Schema({
    status:  {
        type: String,
        required: true
    },
    errMessage:  {
        type: String,
        required: true
    },
    isEval: {
        type: String,
        default: false
    },
    roll: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    QR: {
        type: String,
        required: true
    },
    results: {
        type: [String],
        required: true
    },
    exam: {
        type: Schema.Types.ObjectId, // Referring to an exam id
        ref: 'Exam',
        required: true
    },
    score: {
        type: Number,
        default: 0
    },
    rightAns: {
        type: Number,
        default: 0
    },
    wrongAns: {
        type: Number,
        default: 0
    },
    studentBranch: {
        type: String,
        required: true
    },
    studentPhone: {
        type: String,
        required: true
    },
    centralMerit: {
        type: String,
        default: "NO"
    },
    branchMerit: {
        type: String,
        default: "NO"
    },
    wrongAnswerPositions: {
        type: [Number], // Array of integers indicating the positions of wrong answers
        default: [],
      },
      evaluator:  {
        type: String,
        required: true
    }
});

// Ensure roll and exam combination is unique
ResultSchema.index({ roll: 1, exam: 1 }, { unique: true });

// Create the Result model based on the schema

module.exports = secondaryConnection.model('Result', ResultSchema);
