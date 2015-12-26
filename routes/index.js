var express = require('express');
var router = express.Router();
var path = require('path');
var buffer = require('buffer');
var request = require('request');
var keys = require('../private/keys.js');

//var PROJECT_DIRECTORY = process.env.PWD;
var REDIRECT_URI = 'http://localhost:3000/auth';
var RDIO_ID = 'pz3i3g4smfdofidsegap6d5c3y';
var RDIO_SECRET = keys.RDIO_SECRET; // Private

var SPOTIFY_ID = '3eb36ca7e3274cfb9c23cb59e030fe57';
var SPOTIFY_SECRET = keys.SPOTIFY_SECRET; //Private

/* TODO: Jade templating? */

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(process.env.PWD, 'views', 'index.html'));
});

/* OAuth 2.0 */
router.get('/auth', function(req, res, next) {
	var service = req.query.service;
	var code = req.query.code;

	var authorizationVal = 'Basic ';
	var postRequestOptions = {};

	if (service == 'rdio') {
		authorizationVal += new Buffer(RDIO_ID + ':' + RDIO_SECRET).toString('base64');

		postRequestOptions = {
			url: 'https://services.rdio.com/oauth2/token',
			headers: {
				'Authorization': authorizationVal
			},
			form: {
				'grant_type': 'authorization_code',
				'code': code,
				'redirect_uri': REDIRECT_URI + '?service=rdio'
			}
		};
	}
	else if (service == 'spotify') {
		authorizationVal += new Buffer(SPOTIFY_ID + ':' + SPOTIFY_SECRET).toString('base64');

		postRequestOptions = {
			url: 'https://accounts.spotify.com/api/token',
			headers: {
				'Authorization': authorizationVal
			},
			form: {
				'grant_type': 'authorization_code',
				'code': code,
				'redirect_uri': REDIRECT_URI + '?service=spotify'
			}
		};
	}
	else {
		console.log('none');
		return;
	}

	request.post(postRequestOptions, function(err, res, body) {
		console.log(res.statusCode);
		console.log(body);
	});
});

module.exports = router;
