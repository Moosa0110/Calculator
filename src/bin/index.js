import express, { json } from "express";
import calculatorRouter from "../routes/calculatorRouter.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(json());

app.use("/", calculatorRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


