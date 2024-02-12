const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("<h1>Hiii, You are on ChitChat Server</h1>");
});
router.use("/api", require("./apiRoutes"));

module.exports = router;
