var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Services = require('../models/Services.js');
var ServicesHistory = require('../models/ServicesHistory.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET services listing. */
router.get('/', function(req, res, next) {
  Services.find(function (err, services) {
    if (err) return next(err);
    res.render('services',{title: "RusHour | Services", services: services});
  });
});

/* GET services listing. JSON */
router.get('/all', function(req, res, next) {
  Services.find(function (err, services) {
    if (err) return next(err);
    res.json(services);
  });
});

/* GET /services/id (view particular service.) */
router.get('/id/:id', function(req, res, next) {
  Services.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST services (create new service.) */
router.post('/', function(req, res, next) {
  Services.create(req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* POST services (increment count of rush.) */
router.post('/update_count', function(req, res, next) {
  if (req.body.operator == "inc") {
    Services.findByIdAndUpdate(req.body.id, { $inc: { count: req.body.count } }, function (err, post) {
      if (err) return next(err);
      // add to log in the history table
      ServicesHistory.create({service_id: req.body.id, name: post["name"], delta: req.body.count, new_count: post["count"], operator: req.body.operator}, function (err, post2) {
        if (err) return next(err);
      });
      res.json(post);
    });
  } else {
    // TODO: check for count going below zero
    Services.findByIdAndUpdate(req.body.id, { $inc: { count: "-"+req.body.count } }, function (err, post) {
      if (err) return next(err);
      // add to log in the history table
      ServicesHistory.create({service_id: req.body.id, name: post["name"], delta: req.body.count, new_count: post["count"], operator: req.body.operator}, function (err, post2) {
        if (err) return next(err);
      });
      res.json(post);
    });
  }
});

/* PUT /services/admins/:id (to append to admins of service) */
router.put('/admins/:id', function(req, res, next) {
	if (req.body.admins) {
	  Services.findByIdAndUpdate(req.params.id, { $push: { admins: req.body.admins } }, function (err, post) {
	    if (err) return next(err);
	    res.json(post);
	  });
	}
});

/* PUT /services/:id */
router.put('/:id', function(req, res, next) {
	  Services.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
	    if (err) return next(err);
	    res.json(post);
	  });
});

/* DELETE /todos/:id */
router.delete('/:id', function(req, res, next) {
  Services.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});

/* GET /services_history/:limit&:service_id */
router.get('/services_history', function(req, res) {
  var query;
  if (req.query["service_id"]) {
    query = ServicesHistory.find({service_id: req.query["service_id"]}).sort({"created_at":-1}).limit(req.query["limit"]);  
  } else {
    query = ServicesHistory.find().sort({"created_at":-1}).limit(req.query["limit"]);  
  }
  
  query.exec(function(err, result) {
      if (!err) {
         res.send(result, {
            'Content-Type': 'application/json'
         }, 200);
      } else {
         res.send(JSON.stringify(err), {
            'Content-Type': 'application/json'
         }, 404);
      }
  });
});

/* GET /search. For autocomplete etc. */
router.get('/search', function(req, res) {
   var regex = new RegExp(req.query["term"], 'i');
   var query = Services.find({name: regex}).sort({"updated_at":-1}).limit(20);
      // Execute query in a callback and return services list
    query.exec(function(err, result) {
        if (!err) {
           // Method to construct the json result set
           // var result = buildResultSet(services);
           res.send(result, {
              'Content-Type': 'application/json'
           }, 200);
        } else {
           res.send(JSON.stringify(err), {
              'Content-Type': 'application/json'
           }, 404);
        }
    });
});

module.exports = router;