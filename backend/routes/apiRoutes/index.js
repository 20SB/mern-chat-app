const express = require("express");
const router = express.Router();

router.use("/user", require("./userRoutes"));
router.use("/chat", require("./chatRoutes"));
router.use("/message", require("./messageRoutes"));

module.exports = router;
