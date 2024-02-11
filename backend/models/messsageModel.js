const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        senderName: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        content: {
            type: String,
            trim: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.Model("Message", messageSchema);
module.exports = Message;
