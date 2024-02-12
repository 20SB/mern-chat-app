const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json, printf } = format;
const env = require("./environment");
const path = require("path");
const rfs = require("rotating-file-stream");

const logDirectory = path.join(__dirname, "../logs/terminal_logs");

// Ensure the log directory exists
require("fs").existsSync(logDirectory) || require("fs").mkdirSync(logDirectory);

const customTimestampFormat = () => {
    const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata", // Indian time zone
    };
    return new Intl.DateTimeFormat("en-IN", options).format(new Date());
};

const logger = () => {
    const myFormat = printf(({ level, message, timestamp }) => {
        return `${timestamp} ${level}: ${message}`;
    });

    // Create a rotating file stream for combined logs
    const combinedFileStream = rfs.createStream("combined.log", {
        interval: "1d", // rotate daily
        path: logDirectory,
        compress: "gzip", // compress rotated logs
    });

    // Create a rotating file stream for error logs
    const errorFileStream = rfs.createStream("error.log", {
        interval: "1d", // rotate daily
        path: logDirectory,
        compress: "gzip", // compress rotated logs
    });

    return createLogger({
        level: "debug",
        format: combine(
            timestamp({
                format: customTimestampFormat,
            }),
            myFormat
        ),
        defaultMeta: { service: "user-service" },
        transports: [
            new transports.Stream({ stream: combinedFileStream }),
            new transports.Stream({ stream: errorFileStream, level: "error" }),
        ],
    });
};

module.exports = logger();
