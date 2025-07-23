import express from "express";
import {
  getRoot,
  getBalance,
  addBalance,
  calculate,
  updateUser,
  toggleactiveStatus,
  deleteUser,
} from "../controller/calculatorController.js";

const router = express.Router();
// middleware check jwt token
// decrypt , get id and pass that id in below apis
import authenticateToken from "../middleware/authMiddleware.js";
import checkUserExists from "../middleware/checkUserExists.js";
router.get("/", getRoot);
router.get("/balance",authenticateToken, checkUserExists, getBalance  );
router.post("/addBalance",authenticateToken, checkUserExists, addBalance);
router.post("/calculate", authenticateToken, checkUserExists,calculate);
router.put("/update", authenticateToken , checkUserExists , updateUser);
router.patch("/toggle-active" , authenticateToken , checkUserExists , toggleactiveStatus);
router.delete("/delete", authenticateToken,checkUserExists ,deleteUser );
// put , patch, delete
// /action - pass true and false basd on that make user ative and deactive
// /get active/deactive users api - based true false
// add column active in user, based on that from api make user active and deactive

export default router;


