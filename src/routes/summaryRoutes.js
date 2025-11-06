const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { getTodaySummary } = require("../controllers/summaryController");

const router = express.Router();

router.get("/today", verifyToken, getTodaySummary);

module.exports = router;
