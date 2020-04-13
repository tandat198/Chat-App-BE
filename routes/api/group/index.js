const express = require("express");
const router = express.Router();
const { authenticate } = require("../../../middlewares/auth");
const groupController = require("./controller");

router.get("/", authenticate, groupController.getGroupsOfUser);
router.get('/:id/getUsers', authenticate, groupController.getUsersInGroup)
router.post("/", authenticate, groupController.createGroup);
router.post("/addUser", authenticate, groupController.addNewUserToGroup);
router.delete('/:id', authenticate, groupController.deleteGroup)

module.exports = router;
