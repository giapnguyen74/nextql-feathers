const authentication = require("feathers-authentication");
const jwt = require("feathers-authentication-jwt");
const local = require("feathers-authentication-local");

module.exports = function() {
	const app = this;
	const config = {
		secret:
			"220cac0f7d60fb3b50d5e53844076334d3143894836b1c1eb2c4c893ab6454da9da1a8d9147b94068080f0b25dd1d77d896fbb087cb056b815076ee6bd69c62a429d7f412fae52593bd66c0bc1a1b04dcafc37357072a8f26382d734ca830cc44e32c50852feffdd4691229b851a6a08bb1b4a7a14234c813fbb459ff9d519101786caa871d45073da38cf012a2120d0f5cd0f6c4fe33c4ceb383e8c306d46eae714ca96226637763a2f8621e81ccbf0d6f67b0b9306309c87f600043aa1d608fab7073f384a34615fbe7671aa550c869353d342eef9f34914886e44e58b1205f7ce7fff62bf73a8a2bd2451d5e99a09db877073462cf4f24495e5f65ad740c2",
		strategies: ["jwt", "local"],
		path: "/authentication",
		service: "users",
		jwt: {
			header: {
				type: "access"
			},
			audience: "https://yourdomain.com",
			subject: "anonymous",
			issuer: "feathers",
			algorithm: "HS256",
			expiresIn: "1d"
		},
		local: {
			entity: "user",
			service: "users",
			usernameField: "email",
			passwordField: "password"
		}
	};

	// Set up authentication with the secret
	app.configure(authentication(config));
	//app.configure(jwt());
	app.configure(local(config.local));

	// The `authentication` service is used to create a JWT.
	// The before `create` hook registers strategies that can be used
	// to create a new valid JWT (e.g. local or oauth2)
	app.service("authentication");
};
