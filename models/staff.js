const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const staffSchema = mongoose.Schema({
  loginID: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  NRIC: { type: String, require: true, unique: true },
  name: { type: String, require: true },
  gender: { type: String, require: true },
  contact: { type: Number, require: true },
  role: { type: String, require: true },
  speciality: [{ type: String, require: true }],
});

staffSchema.plugin(AutoIncrement, { inc_field: 'staff_id' });

module.exports = mongoose.model('Staff', staffSchema);
