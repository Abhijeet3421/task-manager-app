
import {prisma} from "../prisma/client";

export const getTasks=async(req:any,res:any)=>{
 const {search="",status}=req.query;
 const data=await prisma.task.findMany({
  where:{
   userId:req.userId,
   title:{contains:search},
   ...(status?{completed:status==="true"}:{})
  }
 });
 res.json(data);
};

export const createTask=async(req:any,res:any)=>{
 const t=await prisma.task.create({data:{...req.body,userId:req.userId}});
 res.json(t);
};

export const updateTask=async(req:any,res:any)=>{
 const t=await prisma.task.update({where:{id:req.params.id},data:req.body});
 res.json(t);
};

export const deleteTask=async(req:any,res:any)=>{
 await prisma.task.delete({where:{id:req.params.id}});
 res.json({msg:"deleted"});
};
