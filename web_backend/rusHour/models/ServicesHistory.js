// this will contain the record of all updates to services count

var mongoose = require('mongoose');

var ServicesHistorySchema = new mongoose.Schema({
  service_id: String,
  name: String,
  operator: String,
  delta: Number,
  new_count: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServicesHistory', ServicesHistorySchema);