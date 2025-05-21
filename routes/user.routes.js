import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/user.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorized, getUsers);
userRouter.get("/:id", authorized, getUser);
userRouter.post("/", authorized, createUser);
userRouter.delete("/:id", authorized, deleteUser);
userRouter.put("/:id", authorized, updateUser);

export default userRouter;
