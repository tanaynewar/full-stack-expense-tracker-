CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

CREATE TABLE IF NOT EXISTS users (
  user_id    INT          NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)  NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  is_active  BOOLEAN      DEFAULT TRUE,
  PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS transactions (
  txn_id      INT           NOT NULL AUTO_INCREMENT,
  user_id     INT           NOT NULL,
  type        ENUM('income','expense') NOT NULL,
  category    VARCHAR(50)   NOT NULL,
  amount      DECIMAL(10,2) NOT NULL,
  description TEXT,
  txn_date    DATE          NOT NULL,
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (txn_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS budget_limits (
  limit_id     INT           NOT NULL AUTO_INCREMENT,
  user_id      INT           NOT NULL,
  category     VARCHAR(50)   NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  month_year   DATE          NOT NULL,
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (limit_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id INT          NOT NULL AUTO_INCREMENT,
  user_id    INT          NOT NULL,
  token      VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP    NOT NULL,
  PRIMARY KEY (session_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);