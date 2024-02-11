const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type:String,
        trim: true,
        required: true,
        default: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    pic:{
        type: String,
        default: ""
    }
},{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;