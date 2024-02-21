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

        socket.on("typing", (room) => {
            socket.in(room).emit("typing");
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

        socket.off("setup", ()=>{
            console.log("USER Disconnected");
            socket.leave(userData._id);
        })
    });
};
