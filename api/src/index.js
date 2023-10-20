const { app } = require("./app");

const PORT = process.env.PORT || 3000;

const start = async () => {
  if (!process.env.QB_CLIENT_ID) {
    throw new Error("QB_CLIENT_ID must be defined");
  }

  if (!process.env.QB_CLIENT_ID) {
    throw new Error("QB_CLIENT_SECRET must be defined");
  }

  if (!process.env.COOKIE_KEY) {
    throw new Error("COOKIE_KEY must be defined");
  }

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
  });
};

start();
