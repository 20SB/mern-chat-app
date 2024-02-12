const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const logger = require("../config/logger");

module.exports.register = asyncHandler(async (req, res) => {
    // logger.info(`info log\n`);
    // logger.error(`Error in Lock status \nError:  \n`);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fileds");
    }
    console.log("files", req.file);
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    if (req.file) {
        dp = `/${req.file.path}`;
    }
    const user = await User.create({
        name,
        email,
        password,
        dp,
    });
    if (user) {
        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    dp: user.dp,
                },
                token: jwt.sign(user.toJSON(), env.jwtSecret, {
                    expiresIn: "30d",
                }),
                file: req.file,
            },
        });
    } else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});

module.exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        res.status(401);
        throw new Error("Invalid Username or Password");
    }
    return res.status(200).json({
        success: true,
        message: "User Registered Successfully",
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                dp: user.dp,
            },
            token: jwt.sign(user.toJSON(), env.jwtSecret, {
                expiresIn: "30d",
            }),
        },
    });
});
