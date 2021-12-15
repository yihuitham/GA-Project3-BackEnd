const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  name: { type: String, require: true },
  id: { type: Number, require: true, min: 7 },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  bloodType: { type: String, require: true },
  medicalConditions: { type: String, require: true },
  medicalRecords: { type: String },
});

module.exports = mongoose.model('Patient', patientSchema);
