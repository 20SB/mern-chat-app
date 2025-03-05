// backend\routes\index.js
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send(`<h1>Hiii, You are on ChitChat Server</h1>`);
});
router.use("/api", require("./apiRoutes"));
router.use("/auth", require("./googleOauth"));

module.exports = router;
