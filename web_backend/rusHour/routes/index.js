var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Users = require('../models/Users.js');
var ServicesReviews = require('../models/ServicesReviews.js');
var UsersSearchHistory = require('../models/UsersSearchHistory.js');

var router = express();
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'RusHour' });
});

// route for login form
// route for processing the login form
// route for signup form
// route for processing the signup form

// route for showing the profile page
router.get('/profile', isLoggedIn, function(req, res) {
    var ads = "";
    var query = UsersSearchHistory.find({user_facebook_id: req.user.facebook.id}).sort({"created_at":-1});
     query.exec(function(err, result) {
         if (!err) {
            ads = result;
            console.log("searches matching this user are:");
            console.log(result);
         }
     });
    res.render('index', {
        user : req.user, title: 'RusHour | ' + req.user.facebook.name, ads: ads // get the user out of session and pass to template
    });
});

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email', 'user_posts', 'read_stream'] }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'
    }));

// route for logging out
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/profile', isLoggedIn, function(req, res) {
    res.render('index', {
        user : req.user, title: 'RusHour | ' + req.user.facebook.name // get the user out of session and pass to template
    });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    console.log("not auth");
    res.redirect('/');
}


module.exports = router;
