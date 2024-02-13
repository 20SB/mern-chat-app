const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports.accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("UserId param not sent with request");
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.senderName",
        select: "name dp email",
    });

    if (isChat.length > 0) {
        return res.status(200).json({
            success: true,
            message: "chat found",
            data: isChat[0],
        });
    } else {
        var chatData = {
            chatname: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );

            return res.status(200).json({
                success: true,
                message: "new chat created and returned",
                data: fullChat,
            });
        } catch (err) {
            res.status(500);
            throw new Error(err.message);
        }
    }
});

module.exports.fetchChat = asyncHandler(async (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.senderName",
                select: "name dp email",
            });
            return res.status(200).json({
                success: true,
                message: "chats fetched successfully",
                data: results,
            });
        })
        .catch((error) => {
            res.status(500);
            throw new Error(err.message);
        });
});

module.exports.createGroupChat = asyncHandler(async (req, res) => {});

module.exports.renameGroup = asyncHandler(async (req, res) => {});

module.exports.removeFromGroup = asyncHandler(async (req, res) => {});

module.exports.addToGroup = asyncHandler(async (req, res) => {});
