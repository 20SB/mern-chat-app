const express = require("express");
const router = express.Router();

const userHandler = require("../../controllers/userController");

router.post("/register", userHandler.register);

module.exports = router;
