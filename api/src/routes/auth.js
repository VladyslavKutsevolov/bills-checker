const express = require("express");
const { authClient, OAuthClient } = require("../authClient");

const router = express.Router();

router.get("/auth", (req, res) => {
  const authUri = authClient.authorizeUri({
    scope: [OAuthClient.scopes.Accounting, OAuthClient.scopes.OpenId],
    state: "testState",
  });

  res.redirect(authUri);
});

router.get("/callback", async (req, res) => {
  try {
    const authResponse = await authClient.createToken(req.url);
    const { access_token, refresh_token } = authResponse.getJson();
    const relmId = authResponse.token.realmId;

    if (access_token) {
      process.env.QB_ACCESS_TOKEN = access_token;
      process.env.QB_REFRESH_TOKEN = refresh_token;
      process.env.QB_REALM_ID = relmId;

      req.session.isAuthenticated = true;
    }

    res.redirect("http://localhost:3001");
  } catch (e) {
    console.error("Error during authentication", e);
    res.status(500).send("Failed to authenticate");
  }
});

module.exports = router;
