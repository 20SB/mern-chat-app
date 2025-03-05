// backend\routes\index.js
const express = require("express");
const env = require("../config/environment");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send(`<h1>Hiii, You are on ChitChat Server</h1>`);
});
router.get("/envData", async (req, res) => {
    const envData = env
    return res.status(200).json({
        success: true,
        envData: envData,
        users,
    });
});
router.use("/api", require("./apiRoutes"));
router.use("/auth", require("./googleOauth"));

module.exports = router;
