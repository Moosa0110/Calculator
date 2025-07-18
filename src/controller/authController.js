import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);  
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username,email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email, and password are required" });
    }
    const user = await authService.register(username, email, password);
    res.status(200).json(user);
  } catch (err) { 
    res.status(400).json({ error: err.message });
  }
};

