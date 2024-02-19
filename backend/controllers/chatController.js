const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports.accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400);
        throw new Error("UserId param not sent with request");
    }

    Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage")
        .then((chats) => {
            return User.populate(chats, {
                path: "latestMessage.senderName",
                select: "name dp email",
            });
        })
        .then((chats) => {
            if (chats.length > 0) {
                return res.status(200).json({
                    success: true,
                    message: "chat found",
                    data: chats[0],
                });
            } else {
                return Chat.create({
                    chatName: "sender",
                    isGroupChat: false,
                    users: [req.user._id, userId],
                });
            }
        })
        .then((createdChat) => {
            if (createdChat) {
                return Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            }
        })
        .then((fullChat) => {
            if (fullChat) {
                res.status(201).json({
                    success: true,
                    message: "new chat created and returned",
                    data: fullChat,
                });
            }
        })
        .catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });
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

module.exports.createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400);
        throw new Error("Please, Fill all the fileds");
    }

    var users = JSON.parse(req.body.users);
    if (users.length < 2) {
        res.status(400);
        throw new Error("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,
    })
        .then((groupChat) => {
            return Chat.findOne({ _id: groupChat._id })
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
        })
        .then((fullGroupChat) => {
            res.status(201).json({
                success: true,
                message: "new group chat created",
                data: fullGroupChat,
            });
        })
        .catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });
});

module.exports.renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .then((updatedChat) => {
            res.status(200).json({
                success: true,
                message: "group chat name updated",
                data: updatedChat,
            });
        })
        .catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });
});

module.exports.removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    Chat.findById(chatId)
        .then((chat) => {
            if (chat.groupAdmin == userId) {
                let usersWithoutAdmin = chat.users.filter((uId) => uId != userId);
                let gAdmin =
                    usersWithoutAdmin[Math.floor(Math.random() * usersWithoutAdmin.length)];
                chat.groupAdmin = gAdmin;
            }
            return chat.save();
        })
        .then((chat) => {
            return Chat.findByIdAndUpdate(
                chat._id,
                {
                    $pull: { users: userId },
                },
                { new: true }
            )
                .populate("users", "-password")
                .populate("groupAdmin", "-password");
        })

        .then((updatedChat) => {
            res.status(200).json({
                success: true,
                message: "user removed from the group",
                data: updatedChat,
            });
        })
        .catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });
});

module.exports.addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        { new: true }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .then((updatedChat) => {
            res.status(200).json({
                success: true,
                message: "user added to the group",
                data: updatedChat,
            });
        })
        .catch((err) => {
            res.status(500);
            throw new Error(err.message);
        });
});
