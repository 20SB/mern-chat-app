const development = {
    name: "development",
    port: process.env.PORT,
    client_url: "http://localhost:3000",

    db: process.env.MONGO_URI,
    jwtSecret: "mern_chat_development",

    treblleApiKey: process.env.TREBLLE_API_KEY,
    treblleProjectId: process.env.TREBLLE_PROJECT_ID,

    awsAccesskey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKETNAME,

    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};

const production = {
    name: "production",
    port: process.env.PORT,
    client_url: process.env.CLIENT_URL || "http://localhost:3000",

    db: process.env.MONGO_URI,
    jwtSecret: "mern_chat_production",

    treblleApiKey: process.env.TREBLLE_API_KEY,
    treblleProjectId: process.env.TREBLLE_PROJECT_ID,

    awsAccesskey: process.env.AWS_ACCESS_KEY_ID,
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    awsRegion: process.env.AWS_REGION,
    awsBucket: process.env.AWS_BUCKETNAME,

    google_client_id: process.env.GOOGLE_CLIENT_ID,
    google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};

module.exports = development;
