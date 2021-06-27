const express = require("express");
const controller = require("../controllers/transactions.controllers");
const validator = require("../validator/transaction.validator");

const router = express.Router();

// Save transaction
router.post("/transaction", validator.ValidateSaveTransactionRequest, async (req, res) => {
  const transaction = req.body;

  const result = await controller.GenerateTransaction(transaction);
  res.status(result.status).json(result.payload);
});

module.exports = router;