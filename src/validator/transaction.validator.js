const joi = require("joi");
const logger = require("../config/logger");

async function ValidateSaveTransactionRequest(req, res, next) {
  const schema = joi.object().keys({
    symbol: joi.string()
      .max(4)
      .label('coinSymbol')
      .required()
      .messages({
        'string.length': 'coinSymbol must be 4 characters or less',
        'string.base': 'coinSymbol must be a string',
      }),
    type: joi.string()
      .label('type')
      .valid('deposit', 'withdrawal')
      .required()
      .messages({
        'string.only': 'type must be either deposit or withdrawal',
        'string.base': 'type must be a string',
      }),
    emailAddress: joi.string()
      .email()
      .label('emailAddress')
      .required()
      .messages({
        'string.email': 'emailAddress must be a valid email address',
        'string.required': 'emailAddress is required',
      }),
    numberOfCoins: joi.number()
      .min(1)
      .label('numberOfCoins')
      .required()
      .messages({
        'number.min': 'numberOfCoins must be greater than 0',
        'number.base': 'numberOfCoins must be a number',
      }),
  });

  const valid = await schema.validateAsync(req.body)
    .catch((error) => {
      logger.error(error);
      return {
        status: 'error',
        message: error.message,
      };
    });

  if (valid.status === 'error') {
    return res.status(400).send(valid);
  }

  next();
}

module.exports = {
  ValidateSaveTransactionRequest
};
