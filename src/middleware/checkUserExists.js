
import pool from '../utility/db.js';

const checkUserExists = async (req, res, next) => {
  try {
  
    const { userId } = req.user;         

    const result = await pool.query(
      'SELECT * FROM calculator_app WHERE id = $1',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User does not exist' });
    }

    req.dbUser = result.rows[0];   
    next();                        
  } catch (err) {
    console.error('checkUserExists error:', err);
    res.status(500).json({ error: 'User validation failed' });
  }
};

export default checkUserExists;

 