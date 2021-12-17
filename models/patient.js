const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  name: { type: String, require: true },
  nric: { type: Number, require: true, min: 7, unique: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  bloodType: { type: String, require: true },
  allergy: [{ type: String, require: true }],
  medicalCondition: { type: String, require: true },
  medicalRecord: { type: String },
});

module.exports = mongoose.model('Patient', patientSchema);
