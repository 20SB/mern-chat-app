const development = {
    name: "development",
    port: process.env.PORT,
    db: process.env.MONGO_URI,
    jwtSecret: "mern_chat_development",

    treblleApiKey: process.env.TREBLLE_API_KEY,
    treblleProjectId: process.env.TREBLLE_PROJECT_ID,

    awsAccesskey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKETNAME,
};

module.exports = development;
