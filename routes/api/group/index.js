const express = require("express");
const router = express.Router();
const { authenticate } = require("../../../middlewares/auth");
const groupController = require("./controller");

router.get("/", authenticate, groupController.getGroups);
router.post("/", authenticate, groupController.createGroup);
router.post("/addUser", authenticate, groupController.addNewUserToGroup);
router.delete('/:id', authenticate, groupController.deleteGroup)
module.exports = router;
