const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const env = require("../config/environment");

// Define the controller function for handling Google login
module.exports.googleLogin = asyncHandler(async (req, res) => {
    // Check if user is authenticated
    if (req.user) {
        // Extract necessary information from Google user data
        const googleUser = req.user;
        const name = googleUser.displayName;
        const email = googleUser.emails[0].value;
        const dp = googleUser.photos[0].value;

        // Check if the user already exists in the database
        let user = await User.findOne({ email });

        if (!user) {
            // If the user doesn't exist, create a new user account
            user = await User.create({
                name,
                email,
                // Generate a random password for the user
                password: crypto.randomBytes(10).toString("hex"),
                dp,
            });
        }

        /* Logout the user (bcoz we are storing user data in the client-side local storage, and there's no need to maintain session data in cookies. This prevents any confusion or ambiguity between the session data and the data stored in local storage.) */
        let message = "";
        req.logout({}, (err) => {
            if (err) {
                console.error(err);
                message += "Google session Logout failed but ";
            }
        });

        const resData = {
            message: message + "Google User Logged in Successfully",
            data: {
                user: user,
                token: jwt.sign(user.toJSON(), env.jwtSecret, {
                    expiresIn: "30d", // Token expiry time
                }),
            },
            success: true,
        };
        const resDataString = JSON.stringify(resData);

        res.redirect(
            `${env.client_url}?google_login_data=${resDataString}`
        );
    } else {
        const resData = {
            message: "Google Login Failed",
            success: false,
        };
        const resDataString = JSON.stringify(resData);
        res.redirect(
            `${env.client_url}?google_login_data=${resDataString}`
        );
    }
});
