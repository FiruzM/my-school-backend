import { Router } from "express";
import {
  getAllPermissions,
  getPermission,
  createPermission,
} from "../controllers/permission.controller.js";

import { authorized } from "../middlewares/auth.middleware.js";

const permissionRouter = Router();

permissionRouter.get("/", authorized, getAllPermissions);
permissionRouter.get("/:id", authorized, getPermission);
permissionRouter.post("/", authorized, createPermission);
permissionRouter.delete("/:id", (req, res) =>
  res.send({ title: "delete user" })
);
permissionRouter.put("/:id", (req, res) => res.send({ title: "update user" }));

export default permissionRouter;
