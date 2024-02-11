const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

module.exports.register = asyncHandler(async function (req, res) {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter all the Fileds");
    }

    const userExists = await User.findOne({email});

    if(userExists){
        res.status(400);
        throw new Error("User Already Exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        pic,
    });

    if (user) {
        res.status(201).json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
            },
            success: true,
            message: "User Registered Successfully"
        });
    } else {
        res.status(400);
        throw new Error("Failed to Create the User");
    }
});
