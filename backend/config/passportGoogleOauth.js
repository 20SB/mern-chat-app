const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const env = require("../config/environment");

passport.use(
    new GoogleStrategy(
        {
            clientID: env.google_client_id,
            clientSecret: env.google_client_secret,
            callbackURL: "/auth/google/callback",
            scope: ["profile", "email"],
        },
        function (accessToken, refreshToken, profile, callback) {
            callback(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Export the configured passport instance
module.exports = passport;
