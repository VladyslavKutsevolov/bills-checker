const express = require("express");
const { checkBills } = require("../utils");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

router.get("/check-bills", requireAuth, async (req, res) => {
  const { message, bills } = await checkBills();

  console.log("bills", bills);
  console.log("msg", message);
  res.json({ message, bills });
});

module.exports = router;
