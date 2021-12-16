const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const staffSchema = mongoose.Schema({
  name: { type: String, require: true },
  gender: { type: String, require: true },
  contact: { type: Number, require: true },
  role: { type: String, require: true },
  speciality: [{ type: String, require: true }],
});

staffSchema.plugin(AutoIncrement, { inc_field: 'staff_id' });

module.exports = mongoose.model('Staff', staffSchema);
