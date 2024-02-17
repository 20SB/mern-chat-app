const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const logger = require("../config/logger");
const AWS = require("../config/aws");
const s3 = new AWS.S3();
const BUCKETNAME = process.env.AWS_BUCKETNAME;

module.exports.register = asyncHandler(async (req, res) => {
    // logger.info(`info log\n`);
    // logger.error(`Error in Lock status \nError:  \n`);

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User Already Exists");
        // return res.status(400).json({
        //     success: true,
        //     message: "User Already Exists",
        // });
    }

    let dp = "";
    if (req.file) {
        console.log(req.file);
        const uploadParams = {
            Bucket: BUCKETNAME,
            Key: `${"DP"}/${req.file.originalname}`,
            Body: req.file.buffer,
        };

        try {
            const data = await s3.upload(uploadParams).promise();
            console.log(data);
            dp = data.Location;
        } catch (err) {
            console.error("Error uploading file to S3:", err);
            res.status(500);
            throw new Error("Error in storing DP, try after sometime");
        }
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
        data: {
            users,
        },
    });
});
