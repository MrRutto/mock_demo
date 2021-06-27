const express = require("express");
const cors = require("cors");
const uuid = require("uuid");
const httpContext = require("express-http-context");
const { createNamespace } = require("continuation-local-storage");
const db = require("./config/database");
const logger = require("./config/logger");

const newRequest = createNamespace("new_request");

const app = express();

app.use(httpContext.middleware);
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use((req, res, next) => {
  newRequest.run(() => {
    newRequest.set("reqId", uuid.v4());
    next();
  });
});
logger.info("test");

db.TestDatabaseConnection();

//  process error
app.use((err, req, res, next) => {
  const error = new Error("Not found");
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  // eslint-disable-next-line no-param-reassign
  err.status = 404;
  next(error);
});

//  global error handling
// will print stacktrace
if (app.get("env") === "development") {
  app.use((err, req, res) => {
    res.status(err.status || 500).json({
      code: err.message,
      error: err,
    });
  });
}

module.exports = app;
