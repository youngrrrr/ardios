var express = require('express');
var router = express.Router();
// var path = require('path');

var PROJECT_DIRECTORY = process.env.PWD;

/* TODO: Jade templating? */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(PROJECT_DIRECTORY + '/views/index.html');
  // res.render('index', { title: 'Express' });
});

module.exports = router;
