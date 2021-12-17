const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const operationSchema = mongoose.Schema({
  operatingRoom: { type: Number, require: true, min: 1, max: 8 },
  surgeonID: { type: mongoose.Types.ObjectId, required: true, ref: 'Staff' },
  nursesID: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Staff' }],
  patientID: { type: String, require: true },
  date: { type: String, require: true },
  time: { type: String, require: true },
  description: { type: String, require: true },
});

operationSchema.plugin(AutoIncrement, { inc_field: 'operation_id' });

module.exports = mongoose.model('Operation', operationSchema);
