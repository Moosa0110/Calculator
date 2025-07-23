 import pool from '../utility/db.js';
 


 // Get balance for user
export const getUserBalanceById= async (userId) => {
  const result = await pool.query(
    `SELECT balance FROM calculator_app WHERE id = $1`,
    [userId]
  );
  return result.rows[0]?.balance ?? null;
};

// Add or subtract balance
export const updateUserBalanceById = async (userId , amountChange) => {
  const result = await pool.query(
    `UPDATE calculator_app
     SET balance = balance + $2
     WHERE id = $1
     RETURNING balance`,
    [userId, amountChange]
  );
  return result.rows[0]?.balance;
};