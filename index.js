const express = require("express");
const cors = require("cors");
const path = require("path");
const { Result, ResultEng, ResultMedi } = require("./models/Result"); // Correctly import models
const { Exam, ExamEng, ExamMedi } = require("./models/Exam"); // Import Exam models for each DB
const Profile = require("./models/Profile");
require("dotenv").config();

// create express app
const app = express();

app.use(express.json());
app.use(cors());

// constants
const port = 3000;

// set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// home route
app.get("/", (req, res) => {
  res.render("amolnama");
});

app.get("/engineering", (req, res) => {
  res.render("eng");
});

app.get("/medical", (req, res) => {
  res.render("medi");
});

app.post("/search/engineering", async (req, res) => {
  const { roll } = req.body;
  await fetchExamData(res, ResultEng, ExamEng, roll);
});

app.post("/search", async (req, res) => {
  const { roll } = req.body;
  await fetchExamData(res, Result, Exam, roll);
});

app.post("/search/medical", async (req, res) => {
  const { roll } = req.body;
  await fetchExamData(res, ResultMedi, ExamMedi, roll);
});

async function fetchExamData(res, ResultModel, ExamModel, roll) {
  try {
    const studentRoll = roll;

    const results = await ResultModel.find({ roll: studentRoll }).populate(
      "exam"
    );
    console.log(results);
    if (!results || results.length === 0) {
      return res.status(200).json({ exams: [] });
    }

    const now = new Date();
    const studentProfile = await Profile.findOne({ roll: studentRoll });
    const Branch = studentProfile.Branch;
    const highestMark = {};

    for (const element of results) {
      const exam_id = element.exam._id;

      // Find the highest mark across all branches
      const highestOverallMark = await ResultModel.findOne({
        exam: exam_id,
      }).sort({
        score: -1,
      });

      // Find the highest mark within the specific branch
      const highestBranchMark = await ResultModel.findOne({
        exam: exam_id,
        studentBranch: Branch,
      }).sort({
        score: -1,
      });

      highestMark[exam_id] = {
        highestOverall: highestOverallMark ? highestOverallMark.score : "N/A",
        highestInBranch: highestBranchMark ? highestBranchMark.score : "N/A",
      };
    }

    // Prepare an array of exam data
    const examsData = results.map((result) => ({
      examType: result.exam.type,
      writtenMark: result.writtenScore,
      examId: result.exam._id,
      resultPublished: now >= new Date(result.exam.resultPublishTime),
      examCut: result.exam.cutMarks,
      examName: result.exam.name,
      examDate: new Date(result.exam.date), // Convert to Date object for sorting
      mark: result.score,
      highestMark: highestMark[result.exam._id]?.highestOverall,
      branchHighest: highestMark[result.exam._id]?.highestInBranch,
      branchMerit: result.branchMerit,
      centralMerit: result.centralMerit,
      rightAns: result.rightAns,
      wrongAns: result.wrongAns,
    }));

    // Send the sorted exam data
    res.status(200).json({ exams: examsData });
  } catch (error) {
    console.error("Error fetching exam data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching exam data." });
  }
}

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
