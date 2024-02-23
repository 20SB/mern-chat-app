const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: {
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
        isFileInput: {
            type: Boolean,
            default: false,
        },
        filesType: {
            type: String,
            trim: true,
            validate: {
                validator: function (value) {
                    // Check if the value is one of the specified types
                    return ["img", "vid", "doc"].includes(value);
                },
                message: (props) =>
                    `${props.value} is not a valid fileType. Must be 'img', 'vid', 'doc', or 'other'.`,
            },
        },
        file: {
            type: String,
            required: function () {
                return this.isFileInput === true;
            },
        },
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
