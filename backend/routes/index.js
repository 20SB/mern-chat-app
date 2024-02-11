const express =require("express");
const router = express.Router();

router.use('/api', require("./apiRoutes"));

module.exports =router;