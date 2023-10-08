var express = require('express');
var router = express.Router();

/* GET default home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET home page. */
router.get('/home', function(req, res, next) {
  console.log(`Received a ${req.method} request to ${req.url}`)
  next()
}),
  router.get('/home', function(req, res, next) {
    res.send('Welcome to my first express application')
  });

router.post('/contact', function(req, res, next) {
  console.log(req.body);
  res.send("Contact Information was sent!");
});

module.exports = router;
