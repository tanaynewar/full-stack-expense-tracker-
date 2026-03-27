const pool = require('../config/db');

const userModel = {

  async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT user_id, username, email, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0] || null;
  },

  async create(username, email, passwordHash) {
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  },

  async emailExists(email) {
    const [rows] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0;
  }

};

module.exports = userModel;
