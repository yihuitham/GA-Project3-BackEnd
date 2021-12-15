const mongoose = require('mongoose');

const operationSchema = mongoose.Schema({
  operatingRoom: { type: Number, require: true, min: 1, max: 8 },
  surgeonID: { type: String, require: true },
  nursesID: [{ type: String, require: true }],
  patientID: { type: String, require: true },
  date: { type: String, require: true },
  time: { type: String, require: true },
  description: { type: String, require: true },
});

module.exports = mongoose.model('Operation', operationSchema);
