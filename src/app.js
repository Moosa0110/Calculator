import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js';
import calculatorRouter from './routes/calculatorRouter.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/calculator', calculatorRouter);

export default app;
