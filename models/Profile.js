const mongoose = require('mongoose');
const { primaryConnection } = require('../config/mongodbConnections');

const profileSchema = new mongoose.Schema({
  uid: String,
  Address: String,
  Courses: Array,
  Email: String,
  FbLink: String,
  FbName: String,
  HSC: String,
  Institution: String,
  Name: String,
  Parent: String,
  Phone: String,
  roll: String,
  photo: String,
  Branch: String,
}, { timestamps: true });

module.exports = primaryConnection.model('Profile', profileSchema);
