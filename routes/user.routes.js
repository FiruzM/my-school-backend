import { Router } from "express";
import {
  getUser,
  getUsers,
  createUser,
} from "../controllers/user.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorized, getUsers);
userRouter.get("/:id", authorized, getUser);
userRouter.post("/", authorized, createUser);
userRouter.delete("/:id", (req, res) => res.send({ title: "delete user" }));
userRouter.put("/:id", (req, res) => res.send({ title: "update user" }));

export default userRouter;
