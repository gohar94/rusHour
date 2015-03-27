// schema for Users

var mongoose = require('mongoose');

var UsersSchema = new mongoose.Schema({
  name: String,
  facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
  provider: String,
  username: String,
  password: String,
  phone: String,
  email: String,
  note: String,
  favourites: [{type: String}],
  premium: Boolean,
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Users', UsersSchema);