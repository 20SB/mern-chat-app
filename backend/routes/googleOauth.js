const express = require("express");
const router = express.Router();
const googleLoginController = require("../controllers/googleLoginController");
const passport = require("passport");
const env = require("../config/environment");

// ------------------------------------------------------------------------
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: env.client_url,
        failureRedirect: env.client_url,
    })
);

router.get("/login/success", googleLoginController.googleLogin);

router.get(
    "/google",
    passport.authenticate("google", ["profile", "email"])
);

module.exports = router;
