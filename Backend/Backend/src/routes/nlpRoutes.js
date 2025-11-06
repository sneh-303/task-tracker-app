const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const { generateTaskSuggestion } = require("../controllers/nlpController");

const router = express.Router();

router.post("/", verifyToken, generateTaskSuggestion);

module.exports = router;
