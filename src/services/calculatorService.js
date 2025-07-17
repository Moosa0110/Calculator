 let balance = 0;

const costMap = {
  "+": 1,
  "-": 2,
  "*": 3,
  "/": 4,
};
export const getCostMap = () => costMap;

export const getBalanceService = () => balance;

export const addBalanceService = (amount) => {
  balance += amount;
  return balance;
};

export const calculateService = (number1, number2, operand) => {
  switch (operand) {
    case "+":
      return number1 + number2;
    case "-":
      return number1 - number2;
    case "*":
      return number1 * number2;
    case "/":
      if (number2 === 0) {
        throw new Error("cannot divide by zero");
      }
      return number1 / number2;
    default:
      throw new Error("Operand must be =,+,-,/");
  }
};
