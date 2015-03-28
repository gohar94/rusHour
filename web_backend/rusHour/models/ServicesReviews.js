// this contains records of all the reviews for services by users

var mongoose = require('mongoose');

var ServicesReviewsSchema = new mongoose.Schema({
  service_id: String,
  username: String,
  user_facebook_id: String,
  user_id: String,
  review: String,
  rating: Number,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServicesReviews', ServicesReviewsSchema);