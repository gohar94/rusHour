var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Users = require('../models/Users.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "907827965914307",
    clientSecret: "ece91de1cdc4a923fd931493fc75898c",
    callbackURL: "http://goharirfan.me:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("in facbeook func");
          //check user table for anyone with a facebook ID of profile.id
          Users.findOne({
              'facebook_id': profile.id 
          }, function(err, user) {
              if (err) {
                  return done(err);
              }
              //No user was found... so create a new user with values from Facebook (all the profile. stuff)
              if (!user) {
                console.log("no user found");
                  user = new Users({
                      name: profile.displayName,
                      // email: profile.emails[0].value,
                      username: profile.username,
                      provider: 'facebook',
                      facebook_id: profile.id,
                      //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line
                      facebook: profile._json
                  });
                  user.save(function(err) {
                      if (err) console.log(err);
                      return done(err, user);
                  });
              } else {
                  console.log("user found");
                  //found user. Return
                  return done(err, user);
              }
          });
      }
));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RusHour' });
});

module.exports = router;
