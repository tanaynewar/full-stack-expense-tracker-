const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const transactionController = require('../controllers/transactionController');

const transactionValidation = [
  body('type')
    .notEmpty()
    .withMessage('Type is required')
    .isIn(['income', 'expense'])
    .withMessage('Type must be income or expense'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category must be under 50 characters'),

  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a positive number'),

  body('txn_date')
    .notEmpty()
    .withMessage('Date is required')
    .isDate()
    .withMessage('Date must be a valid date (YYYY-MM-DD)'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description must be under 255 characters')
];

// All routes below are protected — user must be logged in
router.use(authMiddleware);

// GET /api/transactions
router.get('/', transactionController.getAll);

// POST /api/transactions
router.post('/', transactionValidation, transactionController.create);

// DELETE /api/transactions/:id
router.delete('/:id', transactionController.remove);

// GET /api/transactions/summary
router.get('/summary', transactionController.getSummary);

module.exports = router;