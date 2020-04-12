const express = require("express");
const router = express.Router();
const messageController = require("./controller");
const { authenticate } = require("../../../middlewares/auth");

router.post("/", authenticate, messageController.postMessage);

module.exports = router;
