const express = require("express");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/current-user", requireAuth, async (req, res) => {
  res.json({ user: true });
});

module.exports = router;
