import db from '../utility/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (email, password) => {
  const result = await db.query('SELECT * FROM calculator_app WHERE email=$1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { token, user: { id: user.id, email: user.email } };
};

export const register = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await db.query(
    'INSERT INTO calculator_app (username, email, password) VALUES ($1, $2 , $3) RETURNING id, username,email',
    [username,email, hashedPassword]
  );
  return result.rows[0];
};
