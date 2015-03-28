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

router.get('/ads', function(req, res) {
    var ads = [];
    var categories = [];
    var query = UsersSearchHistory.find({user_facebook_id: req.query["user_facebook_id"]}).sort({"created_at":-1});
    query.exec(function(err, result) {
         if (!err) {
            console.log("searches matching this user are:");
            console.log(result);
            for ( var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (categories.indexOf(obj["category"]) == -1) {
                    categories.push(obj["category"]);
                    var array = [];
                    if (obj["category"] == "movie") {
                        array = [obj["category"], "www.a.com"];
                    } else if (obj["category"] == "bakery") {
                        array = [obj["category"], "www.a.com"];
                    } else if (obj["category"] == "desi") {
                        array = [obj["category"], "www.a.com"];
                    } else if (obj["category"] == "continental") {
                        array = [obj["category"], "www.a.com"];
                    } else {
                        array = [obj["category"], "www.else.com"];
                    }
                    ads.push(JSON.stringify(array));
                }
            }
            console.log("final categories are:");
            console.log(categories);
            res.json(JSON.stringify(ads));
        } else {
            res.json(err);
        }
    });
 });

// route for showing the profile page
router.get('/profile', isLoggedIn, function(req, res) {
    var ads = "";
    var categories = "";
    var query = UsersSearchHistory.find({user_facebook_id: req.user.facebook.id}).sort({"created_at":-1});
     query.exec(function(err, result) {
         if (!err) {
            console.log("searches matching this user are:");
            console.log(result);
            for ( var i = 0; i < result.length; i++) {
                var obj = result[i];
                if (categories.indexOf(obj["category"]) == -1)
                    categories = categories + obj["category"] + ",";
            }
            console.log("final categories are:");
            console.log(categories);
         }
     });
    res.render('index', {
        user : req.user, title: 'RusHour | ' + req.user.facebook.name, categories: categories, ads: ads // get the user out of session and pass to template
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
