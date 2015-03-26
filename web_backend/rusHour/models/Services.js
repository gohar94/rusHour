// schema for Services

var mongoose = require('mongoose');

var ServicesSchema = new mongoose.Schema({
  name: String,
  address: String,
  city: String,
  latitude: Number,
  longitude: Number,
  category: String,
  admins: [{type: String}],
  count: { type: Number, default: 0 },
  count_history: [{type: Number}],
  note: String,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Services', ServicesSchema);