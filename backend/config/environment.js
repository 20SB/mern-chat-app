const development = {
    name: "development",
    port: process.env.PORT,
    db: process.env.MONGO_URI,
    jwtSecret: "mern_chat_development",

    treblleApiKey: process.env.TREBLLE_API_KEY,
    treblleProjectId: process.env.TREBLLE_PROJECT_ID,
};

module.exports = development;
