require("dotenv").config();
const express = require("express");
const cookieSession = require("cookie-session");
const cors = require("cors");

const checkBillsRoute = require("./routes/check-bills");
const authRoute = require("./routes/auth");
const currentUserRoute = require("./routes/current-user");
const logoutRoute = require("./routes/logout");

const app = express();

const apiRouter = express.Router();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apiRouter.use(checkBillsRoute);
apiRouter.use(authRoute);
apiRouter.use(currentUserRoute);
apiRouter.use(logoutRoute);

app.use("/api", apiRouter);

module.exports = { app };
