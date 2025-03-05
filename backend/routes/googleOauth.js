// backend\routes\googleOauth.js
const express = require("express");
const router = express.Router();
const googleLoginController = require("../controllers/googleLoginController");
const passport = require("passport");
const env = require("../config/environment");

// ------------------------------------------------------------------------

// router.get(
//   "/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// router.get("/google/callback", passport.authenticate("google", {}), googleLoginController.googleLogin);

// Google login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), googleLoginController.googleLogin);

module.exports = router;
