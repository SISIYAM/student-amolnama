const express = require("express");
const cors = require("cors");
const path = require("path");
const Result = require("./models/Result");
const Exam = require("./models/Exam");
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

app.get("/", (req, res) => {
  res.render("amolnama");
});

// api for search student amolnama
app.post("/search", async (req, res) => {
  const { roll } = req.body;

  try {
    // Get the student's roll from the authenticated user
    const studentRoll = roll;

    // Find all results associated with the student's roll
    const results = await Result.find({ roll: studentRoll }).populate("exam");

    // If no results found, send an empty array
    if (!results || results.length === 0) {
      return res.status(200).json({ exams: [] });
    }

    const now = new Date();

    // find highest mark
    // const highestMark = [];
    // for (const element of results) {
    //   const exam_id = element.exam._id;
    //   const findHighestMark = await Result.find({ exam: exam_id })
    //     .sort({ score: -1 })
    //     .limit(1);
    //   highestMark[exam_id] = findHighestMark;
    // }

    const studentProfile = await Profile.findOne({ roll: studentRoll });
    const Branch = studentProfile.Branch;
    const highestMark = {};

    for (const element of results) {
      const exam_id = element.exam._id;

      // Find the highest mark across all branches
      const highestOverallMark = await Result.findOne({ exam: exam_id }).sort({
        score: -1,
      });

      // Find the highest mark within the specific branch
      const highestBranchMark = await Result.findOne({
        exam: exam_id,
        studentBranch: Branch,
      }).sort({
        score: -1,
      });

      highestMark[exam_id] = {
        highestOverall:
          highestOverallMark && highestOverallMark.score
            ? highestOverallMark.score
            : "N/A",
        highestInBranch:
          highestBranchMark && highestBranchMark.score
            ? highestBranchMark.score
            : "N/A",
      };
    }

    // console.log(highestMark.length);
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

    // Sort exams by exam date, from latest to oldest
    //examsData.sort((a, b) => b.examDate - a.examDate);

    // Send the sorted exam data
    res.status(200).json({ exams: examsData });
  } catch (error) {
    console.error("Error fetching exam data:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching exam data." });
  }
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`http://localhost:${port}`);
});
