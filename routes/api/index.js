const express = require("express");
const router = express.Router();

router.use("/users", require("./user"));
router.use("/groups", require("./group"));
router.use("/messages", require("./message"));
router.use("/groupMessages", require("./groupMessage"));
// router.use("/io", require("./io"));
module.exports = router;
