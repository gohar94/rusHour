var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var mongoose = require('mongoose');
var Users = require('../models/Users.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  Users.find(function (err, users) {
    if (err) return next(err);
    res.render('users',{title: "Users", users: users});
  });
});

/* GET /users/id (view particular user.) */
router.get('/:id', function(req, res, next) {
  Users.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST users (create new user.) */
router.post('/', function(req, res, next) {
  Users.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /users/:id */
router.put('/:id', function(req, res, next) {
  Users.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* PUT /users/favourites/:id (to append to favourites of admins) */
router.put('/users/:id', function(req, res, next) {
  if (req.body.admins) {
    Users.findByIdAndUpdate(req.params.id, { $push: { favourites: req.body.favourites } }, function (err, post) {
      if (err) return next(err);
      res.json(post);
    });
  }
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Users.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

module.exports = router;
