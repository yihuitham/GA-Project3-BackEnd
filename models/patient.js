const mongoose = require('mongoose');

const patientSchema = mongoose.Schema({
  hospital: { type: String, require: true, default: 'Mount Elizabeth' },
  name: { type: String, require: true },
  nric: { type: String, require: true, min: 9, unique: true },
  gender: { type: String, require: true },
  age: { type: Number, require: true },
  bloodType: { type: String, require: true },
  allergy: [{ type: String, require: true }],
  medicalCondition: { type: String, require: true },
});

module.exports = mongoose.model('Patient', patientSchema);
