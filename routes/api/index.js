const express = require("express");
const router = express.Router();

router.use("/users", require("./user"));
router.use("/groups", require("./group"));
router.use("/messages", require("./message"));

module.exports = router;
