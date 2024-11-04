const { secondaryConnection } = require("../config/mongodbConnections"); // Adjust path as needed
const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    startTime: { type: String },
    date: { type: Date, required: true },
    subject: {
      type: String,
      enum: ["Physics", "Chemistry", "Math", "Biology"],
      required: true,
    },
    paper: { type: String, enum: ["Paper 1", "Paper 2"], required: true },
    chapters: { type: [Number], required: true },
    type: { type: String, enum: ["daily", "weekly", "model"], required: true },
    totalQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    perQuestionMarks: { type: Number, required: true },
    negativeMark: { type: Number, required: true },
    totalSets: { type: Number, required: true },
    sets: [
      {
        answerKeys: { type: String, required: true },
      },
    ],
    practiceSheetLink: { type: String },
    solveSheetLink: { type: String },
    solveVideoLink: { type: String },
    resultPublishTime: { type: String, required: true },
    contentPublishTime: { type: String, required: true },
    coverPhoto: { type: String, required: true },
    cutMarks: { type: Number, default: 0 }, // New cutMarks field
  },
  { timestamps: true }
);

// Export the model attached to the secondary connection
module.exports = secondaryConnection.model("Exam", examSchema);
