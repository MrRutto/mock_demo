const Sequelize = require("sequelize");
const logger = require("./logger");

const db = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  username: "root",
  password: "",
  database: "crypto_bank",
  port: process.env.MYSQL_PORT,
});

async function TestDatabaseConnection() {
  try {
    await db.authenticate();
    logger.info("Connection successful");
  } catch (error) {
    logger.error("Unable to connect:", error);
  }
}

module.exports = { db, TestDatabaseConnection };
