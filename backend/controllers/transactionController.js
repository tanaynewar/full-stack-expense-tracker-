const { validationResult } = require('express-validator');
const transactionModel = require('../models/transactionModel');

const transactionController = {

  async getAll(req, res) {
    try {
      const userId = req.user.userId;
      const transactions = await transactionModel.getAll(userId);

      return res.status(200).json({
        message: 'Transactions fetched successfully',
        count: transactions.length,
        data: transactions
      });

    } catch (error) {
      console.error('getAll error:', error.message);
      return res.status(500).json({ message: 'Server error fetching transactions' });
    }
  },

  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.user.userId;
      const { type, category, amount, description, txn_date } = req.body;

      const txnId = await transactionModel.create(
        userId,
        type,
        category,
        amount,
        description,
        txn_date
      );

      const newTransaction = await transactionModel.getById(txnId, userId);

      return res.status(201).json({
        message: 'Transaction created successfully',
        data: newTransaction
      });

    } catch (error) {
      console.error('create error:', error.message);
      return res.status(500).json({ message: 'Server error creating transaction' });
    }
  },

  async remove(req, res) {
    try {
      const userId = req.user.userId;
      const txnId = req.params.id;

      const exists = await transactionModel.getById(txnId, userId);
      if (!exists) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      const deleted = await transactionModel.remove(txnId, userId);
      if (!deleted) {
        return res.status(400).json({ message: 'Could not delete transaction' });
      }

      return res.status(200).json({ message: 'Transaction deleted successfully' });

    } catch (error) {
      console.error('remove error:', error.message);
      return res.status(500).json({ message: 'Server error deleting transaction' });
    }
  },

  async getSummary(req, res) {
    try {
      const userId = req.user.userId;

      const summary = await transactionModel.getSummary(userId);
      const monthly = await transactionModel.getMonthlyTotals(userId);

      const totalIncome = summary
        .filter(r => r.type === 'income')
        .reduce((sum, r) => sum + parseFloat(r.total), 0);

      const totalExpense = summary
        .filter(r => r.type === 'expense')
        .reduce((sum, r) => sum + parseFloat(r.total), 0);

      return res.status(200).json({
        message: 'Summary fetched successfully',
        data: {
          totalIncome,
          totalExpense,
          balance: totalIncome - totalExpense,
          byCategory: summary,
          byMonth: monthly
        }
      });

    } catch (error) {
      console.error('getSummary error:', error.message);
      return res.status(500).json({ message: 'Server error fetching summary' });
    }
  }

};

module.exports = transactionController;