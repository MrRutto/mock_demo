/* eslint-disable no-undef */
const { createLogger, format, transports } = require("winston");

const { printf } = format;
const dotenv = require("dotenv");
const { getNamespace } = require("continuation-local-storage");

require("winston-daily-rotate-file");

dotenv.config();

const myFormat = printf(({ level, message, timestamp }) => {
  const request = getNamespace("new_request");
  const reqId = request.get("reqId");
  return `${timestamp} ${level} ${reqId}: ${message}`;
});

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.prettyPrint(),
    format.json(),
    myFormat
  ),
  defaultMeta: { service: process.env.APP_NAME },
  transports: [
    new transports.File({
      filename: "logs/errors.log",
      level: "error",
      maxsize: 500,
    }),
    new transports.File({
      filename: "logs/combined.log",
      maxsize: 500,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.simple(),
        format.prettyPrint(),
        format.colorize(),
        format.splat(),
        format.json(),
        myFormat
      ),
    })
  );
}

module.exports = logger;
