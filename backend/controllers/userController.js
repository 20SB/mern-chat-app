const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const logger = require("../config/logger");
const awsS3 = require("../config/aws");

module.exports.register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
    }

    let dp = "";
    if (req.file) {
        // console.log(req.file);
        const fileType = "DP";
        const data = await awsS3.upload(fileType, req.file);
        dp = data.Location;
    }

    const user = await User.create({
        name,
        email,
        password,
        dp,
    });
    if (user) {
        return res.status(201).json({
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
    } else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});

module.exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        res.status(400);
        throw new Error("Invalid Username or Password");
    }
    return res.status(200).json({
        success: true,
        message: "Login Successful",
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

module.exports.allSearchedUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search
        ? {
              $or: [
                  { name: { $regex: req.query.search, $options: "i" } },
                  { email: { $regex: req.query.search, $options: "i" } },
              ],
          }
        : {};

    const users = await User.find(keyword)
        .find({ _id: { $ne: req.user._id } })
        .select("-password");
    return res.status(200).json({
        success: true,
        message: "Users Successfully",
        users,
    });
});

// Update user profile
module.exports.updateUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Check if email is provided and unique
    if (email) {
        const userWithEmailExists = await User.findOne({ email });
        if (userWithEmailExists && userWithEmailExists._id.toString() !== req.user._id.toString()) {
            res.status(400);
            throw new Error("Email is already taken");
        }
    }

    // Check if user wants to update dp
    let dp = req.user.dp;
    if (req.file) {
        // Delete previous dp from AWS S3
        if (dp) {
            await awsS3.delete(dp);
        }

        // Upload new dp to AWS S3
        const fileType = "DP";
        const data = await awsS3.upload(fileType, req.file);
        dp = data.Location;
    }

    // Update user in database
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, email, password, dp },
        { new: true }
    );

    if (!user) {
        res.status(400);
        throw new Error("Failed to update user");
    }

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                dp: user.dp,
            }}
    });
});

// Delete user account
module.exports.deleteUser = asyncHandler(async (req, res) => {
    const user = req.user;

    // Delete user's dp from AWS S3
    if (user.dp) {
        await awsS3.delete(user.dp);
    }

    // Delete user account from the database
    const deletedUser = await User.findByIdAndDelete(user._id);

    if (!deletedUser) {
        res.status(400);
        throw new Error("Failed to delete user");
    }

    return res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});
