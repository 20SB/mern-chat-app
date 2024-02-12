const passport = require("passport");
const JWTStartegy = require("passport-jwt").Strategy;
const extractJWT = require("passport-jwt").ExtractJwt;
const env = require("./environment");

const User = require("../models/userModel");

// Configure options for the JWT authentication strategy
let jwtOptions = {
    jwtFromRequest: extractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwtSecret,
};

// Create a new JWT authentication strategy
passport.use(
    new JWTStartegy(jwtOptions, async function (jwtPayload, done) {
        try {
            const user = await User.findById(jwtPayload._id);
            if (!user) {
                console.log("Error is finding user in JWT");
                return done(null, false);
            }

            // Return the user object to indicate successful authentication
            return done(null, user);
        } catch (err) {
            console.log("Error in Finding User from JWT: ", err);
            // Pass the error to the 'done' callback along with 'false' to indicate authentication failure
            return done(err, false);
        }
    })
);

module.export = passport;
