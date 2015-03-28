// this will contain the history of user searches

var mongoose = require('mongoose');

var UsersSearchHistorySchema = new mongoose.Schema({
  user_facebook_id: String,
  service_id: String,
  service_name: String,
  category: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UsersSearchHistory', UsersSearchHistorySchema);