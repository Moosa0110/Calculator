import {
  getOrCreateUser,
  getUserBalance,
  updateUserBalance,
} from '../services/userService.js';

import {
  calculateService,
  getCostMap,
} from '../services/calculatorService.js';

// Default routing
export const getRoot = (_req, res) => {
  res.json({
    message: "API is running",
    endpoints: {
      getBalance: "GET /balance?username=your_username",
      addBalance: "POST /addBalance",
      calculate: "POST /calculate",
    },
  });
};

// Get Balance
export const getBalance = async (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.status(400).json({ error: "username query param required" });
  }

  await getOrCreateUser(username);
  const balance = await getUserBalance(username);
  res.json({ balance });
};

// Add Balance
export const addBalance = async (req, res) => {
  const { username, amount } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  await getOrCreateUser(username);
  const balance = await updateUserBalance(username, amount);
  res.json({ message: "Balance added", balance });
};

// Calculate
export const calculate = async (req, res) => {
  const { username, number1, number2, operand } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  if (typeof number1 !== "number" || typeof number2 !== "number") {
    return res.status(400).json({ error: "inputs must be numbers" });
  }

  const costMap = getCostMap();
  const cost = costMap[operand];

  if (!cost) {
    return res.status(400).json({ error: "invalid operand" });
  }

  await getOrCreateUser(username);
  const currentBalance = await getUserBalance(username);

  if (currentBalance < cost) {
    return res.status(400).json({ error: "insufficient balance" });
  }

  let result;
  try {
    result = calculateService(number1, number2, operand);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // Deduct cost from balance
  const remainingBalance = await updateUserBalance(username, -cost);

  res.json({ result, costDeducted: cost, remainingBalance });
};




