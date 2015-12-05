var express = require('express');
var router = express.Router();
var path = require('path');
var buffer = require('buffer');
var request = require('request');
var keys = require('../private/keys.js');

//var PROJECT_DIRECTORY = process.env.PWD;
var REDIRECT_URI = 'http://localhost:3000/rdio-code';
var RDIO_ID = 'pz3i3g4smfdofidsegap6d5c3y';
var RDIO_SECRET = keys.RDIO_SECRET; // Private

/* TODO: Jade templating? */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(process.env.PWD, 'views', 'index.html'));
});

router.get('/rdio-code', function(req, res, next) {
  var code = req.query.code;

  var rdioIdSecretAuth = 'Basic ' + new Buffer(
  	RDIO_ID + ':' + RDIO_SECRET).toString('base64');

  request.post({
  	url: 'https://services.rdio.com/oauth2/token',
  	headers: {
  		'Authorization': rdioIdSecretAuth
  	},
  	form: {
  		'grant_type': 'authorization_code',
  		'code': code,
  		'redirect_uri': REDIRECT_URI
  	}
  }, function(error, res, body) {
  	console.log(res.statusCode);
  	console.log(body);
  });

  res.redirect('/');
});

module.exports = router;
