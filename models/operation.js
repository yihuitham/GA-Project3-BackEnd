const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const operationSchema = mongoose.Schema({
  operatingRoom: { type: Number, require: true, min: 1, max: 8 },
  operation: { type: String, require: true },
  surgeonID: { type: mongoose.Types.ObjectId, required: true, ref: 'Staff' },
  nursesID: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Staff' }],
  patientID: { type: mongoose.Types.ObjectId, required: true, ref: 'Patient' },
  date: { type: Date, require: true },
  time: { type: String, require: true },
  description: String,
});

operationSchema.plugin(AutoIncrement, { inc_field: 'operation_id' });

module.exports = mongoose.model('Operation', operationSchema);
