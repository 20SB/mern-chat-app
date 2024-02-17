const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    res.send(`<h1>Hiii, You are on ChitChat Server</h1><p>${url}<p>`);
});
router.use("/api", require("./apiRoutes"));

module.exports = router;
