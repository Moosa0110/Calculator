import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../utility/db.js';
import dotenv from 'dotenv';
dotenv.config(); // load .env variables

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (username, email, password) => {
  const existingUser = await pool.query('SELECT * FROM calculator_app WHERE email=$1', [email]);
  if (existingUser.rows.length > 0) {
    throw new Error('User already exists with this email');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await pool.query(
    'INSERT INTO calculator_app (username, email, password, balance, active) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email',
    [username, email, hashedPassword, 10, true]
  );

  return newUser.rows[0];
};

export const login = async (email, password) => {
  const result = await pool.query('SELECT * FROM calculator_app WHERE email=$1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Incorrect password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token };
};
