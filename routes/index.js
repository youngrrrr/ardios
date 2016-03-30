var express = require('express');
var router = express.Router();
var path = require('path');
var buffer = require('buffer');
var request = require('request');
var keys = require('../private/keys.js');

var Promise = require('bluebird');

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
router.get('/auth', Promise.coroutine(function* (req, res, next) {
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

  var token = yield getSpotifyAccessToken(postRequestOptions);

  res.status(200).send(token);
}));

function getSpotifyAccessToken(postRequestOptions) {
  return new Promise(function(resolve, reject) {
    request.post(postRequestOptions, function(err, res, body) {
      if (err) {
        reject(err);
        return;
      }

      var parsedBody = JSON.parse(body);
      resolve(parsedBody.access_token);
    });
  });
}

router.route('/saved')
  .post(Promise.coroutine(addTracksToSaved));

const MAX_IDS = 50;

function* addTracksToSaved(req, res) {
  var tracksStr = req.body.trackIds.split('\r\n');
  var tracksStrLength = tracksStr.length;

  var spotifyAccessToken = tracksStr[0];

  var batchCounter = 0;
  var batchedTracksStr = '';

  for (var i = 1; i < tracksStrLength; i++) {
    batchedTracksStr += tracksStr[i] + ',';
    batchCounter++;
    if (batchCounter === MAX_IDS) {
      yield putSavedTracks(i, batchedTracksStr, spotifyAccessToken);
      batchedTracksStr = '';
      batchCounter = 0;
    }
  }

  yield putSavedTracks(i, batchedTracksStr, spotifyAccessToken);

  res.status(200).send('Done.');
}

function putSavedTracks(i, tracksStr, accessToken) {
  return new Promise(function(resolve, reject) {
    console.log(i);
    request({
      method: 'PUT',
      uri: 'https://api.spotify.com/v1/me/tracks?ids=' + tracksStr,
      headers: {
        'Authorization': 'Bearer ' + accessToken
      }
    },
    function (error, response, body) {
      if (error) {
        console.error('upload failed:', error)
        reject(error);
        return;
      }

      if (response.statusCode !== 200) {
        console.log(tracksStr, response, body);
      }

      resolve();
    });
  });
}

module.exports = router;
