import express from "express";
import dotenv from "dotenv";
dotenv.config();
import calculatorRouter from "../routes/calculatorRouter.js";
import authRouter from "../routes/authRouter.js";

const app = express();

app.use(express.json());

// Mount routers with namespaces
app.use("/api/calculator", calculatorRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




