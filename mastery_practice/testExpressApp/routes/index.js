var express = require('express');
var router = express.Router();

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  res.send('Welcome to my first express application')
});

module.exports = router;
