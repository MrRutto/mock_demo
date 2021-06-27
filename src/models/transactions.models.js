const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  username: "root",
  password: "",
  database: "crypto_bank",
  port: process.env.MYSQL_PORT,
});

/**
 * Model Definations
 */
// Defining balances model
const balance = sequelize.define('balance', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  coinSymbol: { type: DataTypes.STRING, allowNull: false },
  emailAddress: { type: DataTypes.STRING, allowNull: false },
  numberOfCoins: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  updatedAt: false,
});

// Defining transaction model
const transaction = sequelize.define('transaction', {
  id: { type: DataTypes.INTEGER, primaryKey: true },
  coinSymbol: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('deposit', 'withdrawal'), allowNull: false },
  emailAddress: { type: DataTypes.STRING, allowNull: false },
  numberOfCoins: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  updatedAt: false,
});

/**
 * Get coin balance
 * @param { string } email: email address 
 * @param { string } coin : coinSymbol
 * @returns number
 */
async function FetchCurrentUserBalance(email, coin) {
  const currentBalance = await balance.findOne({
    where: {
      emailAddress: email,
      coinSymbol: coin.toUpperCase(),
    },
    order: [
      ['id', 'DESC']
    ],
  });

  if (currentBalance === null) {
    return 0;
  }
  return currentBalance.numberOfCoins;
}

/**
 * Save balance information
 * @param { object } data: Balance information
 * @param { number } coinBalance: Updated balance
 */
async function SaveBalance(data, coinBalance) {
  await balance.create({
    coinSymbol: (data.symbol).toUpperCase(),
    emailAddress: data.emailAddress,
    numberOfCoins: coinBalance,
  }).catch(err => {
    throw Error(err);
  });
}

/**
 * Save transaction information
 * @param { object } transactionData: transaction information
 * @returns boolean
 */
async function SaveTransaction(transactionData) {
  await transaction.create({
    coinSymbol: transactionData.symbol.toUpperCase(),
    type: transactionData.type,
    emailAddress: transactionData.emailAddress,
    numberOfCoins: transactionData.numberOfCoins,
  }).catch(err => {
    throw Error(err);
  });

  return true;
}


module.exports = {
  FetchCurrentUserBalance,
  SaveBalance,
  SaveTransaction,
}