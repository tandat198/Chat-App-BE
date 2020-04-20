const express = require("express");
const router = express.Router();
const postController = require("./controller");
const { authenticate } = require("../../../middlewares/auth");

router.post("/", authenticate, postController.postNewPost);

module.exports = router;
