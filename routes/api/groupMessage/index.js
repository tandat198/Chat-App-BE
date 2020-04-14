const express = require("express");
const router = express.Router();
const { authenticate } = require("../../../middlewares/auth");
const groupMessageController = require("./controller");

router.get("/", authenticate, groupMessageController.getMessagesOfGroup);

module.exports = router;
