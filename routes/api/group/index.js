const express = require("express");
const router = express.Router();
const { authenticate } = require("../../../middlewares/auth");
const groupController = require("./controller");

router.post("/", authenticate, groupController.createGroup);
router.post("/addUser", authenticate, groupController.addNewUserToGroup);
router.get("/", authenticate, groupController.getGroups);

module.exports = router;
