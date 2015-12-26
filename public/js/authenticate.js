/* http://www.codebelt.com/jquery/open-new-browser-window-with-jquery-custom-size/ */
/* "javascript popup window" */

var REDIRECT_URI = "http://localhost:3000/auth";

$("#authenticate-rdio").click(function() {
	//window.location

	var authParamsRdio = {
		response_type: "code",
		client_id: "pz3i3g4smfdofidsegap6d5c3y",
		redirect_uri: REDIRECT_URI + "?service=rdio",
		mode: 'popup',
		hideSignup: true
	};

	var authUrlRdio = "https://www.rdio.com/oauth2/authorize"
		+ "?"
		+ $.param(authParamsRdio);

	window.open(authUrlRdio, "_blank", "width=400, height=500", "false");
});

$("#authenticate-spotify").click(function() {
	//window.location

	var authParamsSpotify = {
		client_id: "3eb36ca7e3274cfb9c23cb59e030fe57",
		response_type: "code",
		redirect_uri: REDIRECT_URI + "?service=spotify",
		scope: "playlist-modify-public playlist-modify-private user-follow-modify user-library-modify"
	};

	var authUrlSpotify = "https://accounts.spotify.com/authorize"
		+ "?"
		+ $.param(authParamsSpotify);

	window.open(authUrlSpotify, "_blank", "width=400, height=500", "false");
});