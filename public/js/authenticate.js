var REDIRECT_URI = "http://localhost:3000/rdio-code";

$("#authenticate-rdio").click(function() {
	window.location = "https://www.rdio.com/oauth2/authorize"
		+ "?"
		+ $.param(
			{
				response_type: "code",
				client_id: "pz3i3g4smfdofidsegap6d5c3y",
				redirect_uri: REDIRECT_URI,
				mode: 'popup',
				hideSignup: true
			});
});