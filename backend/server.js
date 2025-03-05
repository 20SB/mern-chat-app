// backend\server.js
require("dotenv").config(); // Load environment variables from .env file
const env = require("./config/environment"); // Import environment configuration
const express = require("express"); // Import Express.js framework
const bodyParser = require("body-parser"); // Middleware to parse incoming request bodies
const connectDB = require("./config/mongoose"); // Connect to MongoDB database
const cors = require("cors"); // Middleware to enable CORS (Cross-Origin Resource Sharing)
const passport = require("passport"); // Authentication middleware for Node.js
const passportJWT = require("./config/passportJWT"); // Passport strategy for JSON Web Token (JWT) authentication
const passportGoogleOauth = require("./config/passportGoogleOauth"); // Passport strategy for Gooogle Oauth authentication
const session = require("express-session");
const MongoStore = require("connect-mongo");
const colors = require("colors"); // Library for terminal output coloring
const { notFound, errorHandler } = require("./config/errorHandlerMiddleware"); // Middleware for handling 404 errors and other errors
const path = require("path"); // Module for working with file paths
const fs = require("fs"); // File system module
const { useTreblle } = require("treblle"); // Integration for error tracking with Treblle
// const AWS = require("aws-sdk"); // Uncomment if using AWS SDK
const AWS = require("./config/aws"); // Import AWS configuration

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);

// Initialize passport for authentication
app.use(passport.initialize());
app.use(passport.session());

console.log("client url", env.client_url);
// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204
  })
);

// Error tracking with Treblle
useTreblle(app, {
  apiKey: env.treblleApiKey,
  projectId: env.treblleProjectId,
});

// Serve static files from the 'public' directory
app.use("/public", express.static(path.join(__dirname, "public")));



// Routing
app.use("/", require("./routes")); // Use router defined in 'routes' directory

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define port to listen on
const port = env.port || 5000;

// Start server
const server = app.listen(port, console.log(`Server Started on PORT ${port} - ${env.name}`.yellow.bold));

const io = require("./config/socketIo").socketConfig(server);
