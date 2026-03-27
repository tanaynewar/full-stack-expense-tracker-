const pool = require('../config/db');

const transactionModel = {

  async getAll(userId) {
    const [rows] = await pool.execute(
      `SELECT 
        txn_id,
        type,
        category,
        amount,
        description,
        txn_date,
        created_at
       FROM transactions
       WHERE user_id = ?
       ORDER BY txn_date DESC, created_at DESC`,
      [userId]
    );
    return rows;
  },

  async getById(txnId, userId) {
    const [rows] = await pool.execute(
      `SELECT * FROM transactions
       WHERE txn_id = ? AND user_id = ?`,
      [txnId, userId]
    );
    return rows[0] || null;
  },

  async create(userId, type, category, amount, description, txnDate) {
    const [result] = await pool.execute(
      `INSERT INTO transactions 
        (user_id, type, category, amount, description, txn_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, type, category, amount, description || null, txnDate]
    );
    return result.insertId;
  },

  async remove(txnId, userId) {
    const [result] = await pool.execute(
      `DELETE FROM transactions
       WHERE txn_id = ? AND user_id = ?`,
      [txnId, userId]
    );
    return result.affectedRows > 0;
  },

  async getSummary(userId) {
    const [rows] = await pool.execute(
      `SELECT
        type,
        category,
        SUM(amount)  AS total,
        COUNT(*)     AS count
       FROM transactions
       WHERE user_id = ?
       GROUP BY type, category
       ORDER BY type, total DESC`,
      [userId]
    );
    return rows;
  },

  async getMonthlyTotals(userId) {
    const [rows] = await pool.execute(
      `SELECT
        DATE_FORMAT(txn_date, '%Y-%m') AS month,
        type,
        SUM(amount) AS total
       FROM transactions
       WHERE user_id = ?
       GROUP BY month, type
       ORDER BY month DESC`,
      [userId]
    );
    return rows;
  }

};

module.exports = transactionModel;