const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/logout", requireAuth, async (req, res) => {
  req.session = null;
  res.status(204).send({});
});

module.exports = router;
