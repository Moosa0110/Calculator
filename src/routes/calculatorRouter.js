import express from "express";
import {
  getRoot,
  getBalance,
  addBalance,
  calculate,
} from "../controller/calculatorController.js";

const router = express.Router();

router.get("/", getRoot);
router.get("/balance", getBalance);
router.post("/addBalance", addBalance);
router.post("/calculate", calculate);

export default router;

