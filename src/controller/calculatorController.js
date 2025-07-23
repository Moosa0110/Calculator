import {
  
  getUserBalanceById,
  updateUserBalanceById,
} from '../services/userService.js';

import {
  calculateService,
  getCostMap,
} from '../services/calculatorService.js';
import pool from '../utility/db.js';
// Default routing
export const getRoot = (_req, res) => {
  //jwt token id = get
    // 1,2,4
    // user not authenicated

  res.json({
    message: "API is running",
    endpoints: {
      getBalance: "GET /balance?username=your_username",
      addBalance: "POST /addBalance",
      calculate: "POST /calculate",
      updateUser: "PUT /update",
      toggleActive: "PATCH /toggle-active",
      deleteUser: "DELETE /delete",
    },
  });
};

// Get Balance
export const getBalance = async (req, res) => {
  try{
     const userId=req.user.userId;
     const balance= await getUserBalanceById(userId);
     res.json({balance});
  }
  catch(err){
    res.status(500).json({ error: 'Failed to retrieve balance' });
  }
};

// Add Balance
export const addBalance = async (req, res) => {
  try{
    const userId=req.user.userId;
    const {amount} = req.body;
    if(typeof amount !== 'number' || amount<=0){
      return res.status(400).json({error: 'amount mustt be a positive number'});
    }
    const balance = await updateUserBalanceById(userId,amount);
    res.json({message:'Balance added',balance});
  }catch(err){
    res.status(500).json({error:"Failed to add balance" });
  }
};

// Calculate
export const calculate = async (req, res) => {
  try{
     const userId=req.user.userId;
     const {number1 , number2 , operand} = req.body;
     if(typeof number1!=='number' || typeof number2!=='number'){
      return res.status(500).json({error: 'inputs must be numbers'});
     }
     const costMap = getCostMap();
     const cost=costMap[operand];
     if(!cost){
      return res.status(400).json({error:'invalid operand'});
     }
     const currentBalance = await getUserBalanceById(userId);
     if(currentBalance<cost){
      return res.status(400).json({error:'insufficient balance'});
     } 
     const result = calculateService(number1 , number2 , operand);
     const  remainingbalance= await updateUserBalanceById(userId, -cost);
     res.json({result, costDeducted:cost,remainingbalance});
  }
  catch(err){
    res.status(400).json({error: error.message});
  }
};
//update the user data 
 export const updateUser = async(req,res) => {
  const userId=req.user.userId;
  const {username,email}=req.body;
  if(!username || !email){
    return res.status(400).json({error:"Username and email are required"});
  }
  try{
    const result = await pool.query(
      'UPDATE calculator_app SET username=$1 , email=$2 WHERE id=$3 RETURNING username, email ' , [username, email, userId]
    );
    res.json({message:"User updated" , updateUser:result.rows[0]});
  }catch(err){
    res.status(500).json({error:"failed to update user"});
  }
 };
 //toggle active user
 export const toggleactiveStatus= async (req,res) => {
  const userId = req.user.userId;
  const {active} = req.body;
  if(typeof active!== 'boolean'){
     return res.status(400).json({error: "Active must be true or false "});
  
  }try{
     await pool.query(
      'UPDATE calculator_app SET active=$1 WHERE id=$2' , [active, userId]
     );
     res.json({message:`User is now ${active? 'active':'inactive'}`});
  }catch(err){
    res.status(500).json({error:"Failed to update active status"});
  }
 };
 export const deleteUser = async (req,res) =>{
  const userId=req.user.userId;
  try{
    await pool.query(
      'DELETE FROM calculator_app WHERE id=$1' , [userId]
    );
    res.json({message:"User deleted successfully"});
  }catch(err){
    res.status(500).json({error:"Failed to delete user"});

  }
 };




