// backend\config\passportGoogleOauth.js
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const env = require("../config/environment");

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google_client_id,
      clientSecret: env.google_client_secret,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = {
          email: profile.emails[0].value,
          name: profile.displayName,
          profilePicture: profile.photos[0].value,
        };
        return done(null, user);
      } catch (err) {
        return done(err);
      }
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
