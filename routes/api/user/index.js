const express = require("express");
const router = express.Router();
const userController = require("./controller");
const uploadImage = require("../../../middlewares/uploadImage");
const { authenticate } = require("../../../middlewares/auth");

router.post("/signup", userController.createUser);
router.post("/signin", userController.signIn);
router.post("/upload", userController.uploadAvatar);

module.exports = router;
