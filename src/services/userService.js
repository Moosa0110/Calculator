 import pool from '../utility/db.js';
 //create user if not exists 
 export const getOrCreateUser = async(username)  => {
    const result = await pool.query(
        `INSERT INTO calculator_app(username, balance)
       VALUES ($1,0) 
       ON CONFLICT (username)
       DO UPDATE SET username = EXCLUDED.username
       RETURNING *
       `, [username]
    );
    return result.rows[0];
 };

 // Get balance for user
export const getUserBalance = async (username) => {
  const result = await pool.query(
    `SELECT balance FROM calculator_app WHERE username = $1`,
    [username]
  );
  return result.rows[0]?.balance ?? null;
};

// Add or subtract balance
export const updateUserBalance = async (username, amountChange) => {
  const result = await pool.query(
    `UPDATE calculator_app
     SET balance = balance + $2
     WHERE username = $1
     RETURNING balance`,
    [username, amountChange]
  );
  return result.rows[0]?.balance;
};