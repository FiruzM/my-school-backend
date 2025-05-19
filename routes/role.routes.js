import { Router } from "express";
import {
  getAllRoles,
  createRole,
  getRole,
} from "../controllers/role.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const roleRouter = Router();

roleRouter.get("/", authorized, getAllRoles);
roleRouter.get("/:id", authorized, getRole);
roleRouter.post("/", authorized, createRole);
roleRouter.delete("/:id", (req, res) => res.send({ title: "delete user" }));
roleRouter.put("/:id", (req, res) => res.send({ title: "update user" }));

export default roleRouter;
