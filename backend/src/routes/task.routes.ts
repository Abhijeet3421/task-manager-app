
import {Router} from "express";
import {auth} from "../middleware/auth";
import {getTasks,createTask,updateTask,deleteTask} from "../controllers/task.controller";

const r=Router();
r.get("/",auth,getTasks);
r.post("/",auth,createTask);
r.patch("/:id",auth,updateTask);
r.delete("/:id",auth,deleteTask);
export default r;
