const logger = require("./logger");

module.exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

module.exports.errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    console.log("Error: ", err);

    if (statusCode === 500) {
        logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
    }

    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" && statusCode === 500 ? null : err.stack,
        success: false,
    });
};
