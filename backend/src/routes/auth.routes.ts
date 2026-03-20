import {Router} from "express";
import jwt from "jsonwebtoken";

const r=Router();
r.post("/login",(req,res)=>{
 const token=jwt.sign({userId:"1"},"secret");
 res.json({accessToken:token});
});
r.post("/register",(req,res)=>res.json({msg:"registered"}));
export default r;
