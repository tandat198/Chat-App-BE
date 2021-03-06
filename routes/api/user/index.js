const express = require("express");
const router = express.Router();
const userController = require("./controller");
const upload = require("../../../middlewares/upload");
const { authenticate } = require("../../../middlewares/auth");

router.post("/signup", userController.createUser);
router.post("/signin", userController.signIn);
router.post("/updateProfilePhoto", authenticate, userController.updateProfilePhoto);
router.post('/updateCoverPhoto', authenticate, userController.updateCoverPhoto)
router.post("/upload", authenticate, upload.uploadSingleImage);

module.exports = router;
