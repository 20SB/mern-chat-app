const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messsageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const awsS3 = require("../config/aws");

module.exports.sendMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { content, chatId, isFileInput, fileType } = req.body;

        // Check if the user is part of the chat
        const chatData = await Chat.find({
            _id: chatId,
            users: { $elemMatch: { $eq: req.user._id } },
        });
        if (chatData.length === 0) {
            res.status(400);
            throw new Error("You are not part of the group, therefore you cannot send a message");
        }

        // If isFileInput is true and files are uploaded
        if (isFileInput && req.files) {
            let latestMessageTillNow;
            let messages = [];

            console.log(req.files);
            // Loop over each uploaded file
            for (const file of req.files) {
                const folderName = "FILES";
                const data = await awsS3.upload(folderName, file);

                // Create a new message for each file
                const newMessage = {
                    sender: req.user._id,
                    chat: chatId,
                    isFileInput: isFileInput,
                    fileType: fileType,
                    file: data.Location, // Store file link in an array
                };

                // Create the message
                let message = await Message.create(newMessage);

                // Populate sender and chat fields of the message
                message = await message.populate("sender", "name dp");
                message = await message.populate("chat");
                message = await User.populate(message, {
                    path: "chat.users",
                    select: "name dp email",
                });
                latestMessageTillNow = message;

                messages.push(message);
            }

            // Update the latestMessage field of the chat
            const updatedChat = await Chat.findByIdAndUpdate(
                chatId,
                { latestMessage: latestMessageTillNow },
                { new: true }
            );

            return res.status(200).json({
                success: true,
                message: "Files sent successfully",
                data: {
                    message: messages,
                    chat: updatedChat,
                },
            });
        } else {
            // If no files are uploaded, create a single message without files
            const newMessage = {
                sender: req.user._id,
                content: content,
                chat: chatId,
            };

            let message = await Message.create(newMessage);

            // Populate sender and chat fields of the message
            message = await message.populate("sender", "name dp");
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
        }
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

module.exports.updateMessage = expressAsyncHandler(async (req, res) => {
    try {
        const { messageId, content } = req.body;

        // Find the message to be updated
        const message = await Message.findById(messageId);

        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }

        // Check if the user is the sender of the message
        if (message.sender.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("You can not update other's message");
        }

        // Check if the message is a file input
        if (message.isFileInput) {
            res.status(400);
            throw new Error("File messages cannot be updated");
        }

        // Update the content of the message
        message.content = content;
        let updatedMsg = await message.save();

        // Populate sender and chat fields of the message
        updatedMsg = await updatedMsg.populate("sender", "name dp");
        updatedMsg = await updatedMsg.populate("chat");
        updatedMsg = await User.populate(updatedMsg, {
            path: "chat.users",
            select: "name dp email",
        });
        return res.status(200).json({
            success: true,
            message: "Message updated successfully",
            data: updatedMsg,
        });
    } catch (err) {
        res.status(400);
        throw err;
    }
});

module.exports.deleteMessage = expressAsyncHandler(async (req, res) => {
    try {
        const messageId = req.query.messageId;

        // Find the message to be deleted
        let message = await Message.findById(messageId);

        if (!message) {
            res.status(404);
            throw new Error("Message not found");
        }

        // Check if the user is deleting his own message
        if (message.sender.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error("You can not delete others message");
        }

        // Populate sender and chat fields of the message
        message = await message.populate("sender", "name dp");
        message = await message.populate("chat");
        let deletedMsg = await User.populate(message, {
            path: "chat.users",
            select: "name dp email",
        });

        // If the message contains files and isFileInput is true, delete the files from AWS S3
        if (message.isFileInput && message.file) {
            await awsS3.delete(message.file);
        }

        // Delete the message from the database
        await Message.deleteOne(message);

        // If the message was the latest message of the chat, update the latestMessage field of the chat
        const chat = await Chat.findById(message.chat);
        if (chat && chat.latestMessage && chat.latestMessage.equals(message._id)) {
            // Find the latest message of the chat excluding the deleted message
            const latestMessage = await Message.findOne({
                chat: message.chat,
                _id: { $ne: message._id },
            }).sort({ createdAt: -1 });

            // Update the latestMessage field
            chat.latestMessage = latestMessage;
            await chat.save();
        }

        return res.status(200).json({
            success: true,
            data: deletedMsg,
            message: "Message deleted successfully",
        });
    } catch (err) {
        res.status(400);
        throw err;
    }
});
