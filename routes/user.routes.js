import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  getUserAutocomplete,
} from "../controllers/user.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const userRouter = Router();

// Упорядочено от более конкретных к общим
userRouter.get("/autocomplete", authorized, getUserAutocomplete);
userRouter.get("/:id", authorized, getUser);
userRouter.get("/", authorized, getUsers);
userRouter.post("/", authorized, createUser);
userRouter.put("/:id", authorized, updateUser);
userRouter.delete("/:id", authorized, deleteUser);

export default userRouter;
