const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messsageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

module.exports.sendMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { content, chatId } = req.body;

        // Check if the user is part of the chat
        const chatData = await Chat.find({
            _id: chatId,
            users: { $elemMatch: { $eq: req.user._id } },
        });
        if (chatData.length === 0) {
            res.status(400);
            throw new Error("You are not part of the group, therefore you cannot send a message");
        }

        // Create a new message
        const newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
        };
        let message = await Message.create(newMessage);

        // Populate sender and chat fields of the message
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name dp email",
        });

        // Update the latestMessage field of the chat
        const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            { latestMessage: message },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "New message sent successfully",
            data: {
                message: message,
                chat: updatedChat,
            },
        });
    } catch (err) {
        res.status(400);
        throw err;
    }
});

module.exports.allMessage = expressAsyncHandler((req, res) => {
    // Retrieve all messages of a particular chat
    Message.find({ chat: req.query.chatId })
        .populate("sender", "name dp email")
        .populate("chat")
        .then((messages) => {
            res.status(200).json({
                success: true,
                message: "All messages of a particular chat fetched successfully",
                data: messages,
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                message: err.message,
            });
        });
});
