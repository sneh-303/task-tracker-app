const express = require("express");
const verifyToken = require("../middlewares/authMiddleware");
const {
  startTimer,
  stopTimer,
  getTotalTime,
  getLogsByTask
} = require("../controllers/timeLogController");

const router = express.Router();

router.post("/:taskId/start", verifyToken, startTimer);
router.post("/:taskId/stop", verifyToken, stopTimer);
router.get("/:taskId/total", verifyToken, getTotalTime);
router.get("/:taskId/logs", verifyToken, getLogsByTask);


module.exports = router;
