import { Router } from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/permissionCategory.controller.js";

import { authorized } from "../middlewares/auth.middleware.js";

const permissionCategoryRouter = Router();

permissionCategoryRouter.get("/", authorized, getAllCategories);
permissionCategoryRouter.get("/:id");
permissionCategoryRouter.post("/", authorized, createCategory);
permissionCategoryRouter.delete("/:id", (req, res) =>
  res.send({ title: "delete user" })
);
permissionCategoryRouter.put("/:id", (req, res) =>
  res.send({ title: "update user" })
);

export default permissionCategoryRouter;
