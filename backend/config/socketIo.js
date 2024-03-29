module.exports.socketConfig = function (server) {
    // Socket.IO setup
    const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
            origin: "*",
        },
    });

    // Socket.IO event handlers
    io.on("connection", (socket) => {
        // Log a message when a new client connects
        // console.log("connected to socket.io");

        // Handle the "setup" event emitted by the client
        socket.on("setup", (userData) => {
            // Join a room identified by the user's ID
            socket.join(userData.user._id);
            // Emit a "connected" event back to the client
            socket.emit("connected");
        });

        // Handle the "join chat" event emitted by the client
        socket.on("join chat", (room) => {
            // Join the specified chat room
            socket.join(room);
        });

        // Handle typing event and emit user information along with it
        socket.on("typing", (room, userData) => {
            socket.in(room).emit("typing", userData);
        });
        socket.on("stop typing", (room) => {
            socket.in(room).emit("stop typing");
        });

        // Handle the "new message" event emitted by the client
        socket.on("new message", (newMessageReceived) => {
            // Retrieve the chat object from the received message
            var chat = newMessageReceived.chat;

            // Check if the chat object has a "users" property
            if (!chat.users) {
                // Log a message if users are not defined
                return console.log("chat.users not defined");
            }

            // Iterate over each user in the chat's user list
            chat.users.forEach((user) => {
                // Skip emitting the "message received" event to the sender
                if (user._id === newMessageReceived.sender._id) return;

                // Emit a "message received" event to the user's ID
                socket.in(user._id).emit("message received", newMessageReceived);
            });
        });

        // Handle the "multiple new messages" event emitted by the client
        socket.on("multiple new messages", (newMessagesReceived) => {
            // Retrieve the chat object from the received message

            // as all messages  should be for the same chat, just use the first one
            let chat = newMessagesReceived[0].chat;
            let sender = newMessagesReceived[0].sender;

            // Check if the chat object has a "users" property
            if (!chat.users) {
                // Log a message if users are not defined
                return console.log("chat.users not defined");
            }

            // Iterate over each user in the chat's user list
            chat.users.forEach((user) => {
                // Skip emitting the "message received" event to the sender
                if (user._id === sender._id) return;

                // Emit a "multiple messages received" event to the user's ID
                socket.in(user._id).emit("multiple messages received", newMessagesReceived);
            });
        });

        // Handle the "delete message" event emitted by the client
        socket.on("delete message", (messageDeleted) => {
            // Retrieve the chat object from the deleted message
            var chat = messageDeleted.chat;

            // Check if the chat object has a "users" property
            if (!chat.users) {
                // Log a message if users are not defined
                return console.log("chat.users not defined");
            }

            // Iterate over each user in the chat's user list
            chat.users.forEach((user) => {
                // Skip emitting the "message deleted" event to the sender
                if (user._id === messageDeleted.sender._id) return;

                // Emit a "message deleted" event to the user's ID
                socket.in(user._id).emit("message deleted", messageDeleted);
            });
        });

        // Handle the "update message" event emitted by the client
        socket.on("update message", (messageUpdated) => {
            // Retrieve the chat object from the updated message
            var chat = messageUpdated.chat;

            // Check if the chat object has a "users" property
            if (!chat.users) {
                // Log a message if users are not defined
                return console.log("chat.users not defined");
            }

            // Iterate over each user in the chat's user list
            chat.users.forEach((user) => {
                // Skip emitting the "message updated" event to the sender
                if (user._id === messageUpdated.sender._id) return;

                // Emit a "message updated" event to the user's ID
                socket.in(user._id).emit("message updated", messageUpdated);
            });
        });

        socket.off("setup", () => {
            console.log("USER Disconnected");
            socket.leave(userData._id);
        });
    });
};
