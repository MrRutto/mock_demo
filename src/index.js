/* eslint-disable no-undef */
const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
const logger = require("./config/logger");

const server = http.createServer(app);
dotenv.config();

server.listen(process.env.APP_PORT, () => {
  logger.info(`Server started and listening on ${process.env.APP_PORT}`);
});
