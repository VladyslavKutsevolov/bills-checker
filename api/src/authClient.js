const OAuthClient = require("intuit-oauth");

const authClient = new OAuthClient({
  clientId: process.env.QB_CLIENT_ID,
  clientSecret: process.env.QB_CLIENT_SECRET,
  environment: "sandbox",
  redirectUri: "http://localhost:3000/api/callback",
});

module.exports = { authClient, OAuthClient };
