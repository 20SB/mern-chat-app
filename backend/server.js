require("dotenv").config();
const env = require("./config/environment");
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/mongoose");
const cors = require("cors");
const passport = require("passport");
const passportJWT = require("./config/passportJWT");
const colors = require("colors");
const { notFound, errorHandler } = require("./config/errorHandlerMiddleware");
const path = require("path");
const fs = require("fs");

const app = express();
connectDB();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
    cors({
        origin: "*",
        methods: "GET,POST,PUT,DELETE,PATCH",
        credentials: true,
    })
);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes"));

app.use(notFound);
app.use(errorHandler);

const port = env.port || 5000;
app.listen(port, console.log(`Server Started on PORT ${port}`.yellow.bold));
