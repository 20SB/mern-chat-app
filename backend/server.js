require("dotenv").config();
const express = require("express");
const connectDB = require("./config/mongoose");
const colors = require("colors");
const { notFound, errorHandler } = require("./config/errorHandlerMiddleware");

const app = express();
connectDB();
app.use(express.json());
app.use('/',require("./routes"));

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server Started on PORT ${port}`.yellow.bold),);
