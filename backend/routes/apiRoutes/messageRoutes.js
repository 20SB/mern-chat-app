const express = require("express");
const router = express.Router();
const passport = require("passport");

const messageController = require("../../controllers/messageController");

router.post("/", passport.authenticate("jwt", { session: false }), messageController.sendMessage);
router.get("/", passport.authenticate("jwt", { session: false }), messageController.allMessage);

module.exports = router;
