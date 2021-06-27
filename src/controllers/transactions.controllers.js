const model = require("../models/transactions.models");
const logger = require("../config/logger");

/**
 * Save transaction details
 * @param { object } transaction 
 * @returns { payload: {message, data}, status } res payload
 */
async function GenerateTransaction(transaction) {
  logger.info("Generate transaction started");

  // Check Balances
  const bal = await model.FetchCurrentUserBalance(transaction.emailAddress, transaction.symbol);

  // Validate withdrawal amount 
  if (bal < transaction.numberOfCoins && transaction.type === 'withdrawal') {
    logger.info("Generate transaction ended with conflict");
    return {
      status: 409,
      payload: {
        message: 'transaction exceeds coin balance.',
        availableBalance: bal
      }
    }
  }

  // Calculate new balance
  const balance = (transaction.type === 'withdrawal') ? (bal - transaction.numberOfCoins) : (bal + transaction.numberOfCoins)

  try {
    await model.SaveTransaction(transaction);
    await model.SaveBalance(transaction, balance);
  } catch (err) {
    logger.info("Generate transaction ended with error");
    logger.error(`An error has occured: ${err}`);
    return {
      status: 500,
      payload: {
        message: 'an error occured',
      }
    }
  }

  logger.info("Generate transaction ended successfully");
  return {
    status: 200,
    payload: {
      message: 'transaction success',
    }
  }
}

module.exports = {
  GenerateTransaction,
}