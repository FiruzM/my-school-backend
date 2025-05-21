import { Router } from "express";
import {
  getAllRoles,
  createRole,
  getRole,
  deleteRole,
  updateRole,
} from "../controllers/role.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const roleRouter = Router();

roleRouter.get("/", authorized, getAllRoles);
roleRouter.get("/:id", authorized, getRole);
roleRouter.post("/", authorized, createRole);
roleRouter.delete("/:id", authorized, deleteRole);
roleRouter.put("/:id", authorized, updateRole);

export default roleRouter;
