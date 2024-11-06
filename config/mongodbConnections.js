const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Primary MongoDB connection
const primaryConnection = mongoose.createConnection(process.env.MONGO_URI);

primaryConnection
  .once("open", () => {
    console.log("Primary MongoDB connected");
  })
  .on("error", (err) => {
    console.log("Primary MongoDB connection error:", err);
  });

// Secondary MongoDB connection
const secondaryConnection = mongoose.createConnection(
  process.env.MONGO_URI_SECOND
);

secondaryConnection
  .once("open", () => {
    console.log("Secondary MongoDB connected");
  })
  .on("error", (err) => {
    console.log("Secondary MongoDB connection error:", err);
  });

// Engineering MongoDB connection
const EngineeringConnection = mongoose.createConnection(
  process.env.MONGO_URI_ENG
);

EngineeringConnection.once("open", () => {
  console.log("EngineeringConnection MongoDB connected");
}).on("error", (err) => {
  console.log("EngineeringConnection MongoDB connection error:", err);
});

// Medical MongoDB connection
const MedicalConnection = mongoose.createConnection(process.env.MONGO_URI_MEDI);

MedicalConnection.once("open", () => {
  console.log("MedicalConnection MongoDB connected");
}).on("error", (err) => {
  console.log("MedicalConnection MongoDB connection error:", err);
});

// Export both connections
module.exports = {
  primaryConnection,
  secondaryConnection,
  EngineeringConnection,
  MedicalConnection,
};
