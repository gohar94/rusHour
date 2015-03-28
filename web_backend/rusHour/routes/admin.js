var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('update_service_count', { title: 'RusHour' });
});

/* GET /add page. */
router.get('/add', function(req, res, next) {
  res.render('form', { title: 'RusHour' });
});

/* GET /dash page. */
router.get('/dash', function(req, res, next) {
  res.render('dash', { title: 'RusHour' });
});

/* GET /facebook_parser page. */
router.get('/facebook_parser', function(req, res, next) {
  res.render('facebook_parser', { title: 'RusHour' });
});

module.exports = router;
