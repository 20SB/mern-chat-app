const express = require("express");
const router = express.Router();
const googleLoginController = require("../controllers/googleLoginController");
const passport = require("passport");
const env = require("../config/environment");

// ------------------------------------------------------------------------
router.get(
    "/google/callback",
    passport.authenticate("google", {}),
    googleLoginController.googleLogin
);

router.get(
    "/google",
    passport.authenticate("google", ["profile", "email"])
);

module.exports = router;
