const development = {
    name: "development",
    port: process.env.PORT,
    db: process.env.MONGO_URI,
    jwtSecret: "mern_chat_development" 
};

module.exports = development