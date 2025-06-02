import { Router } from "express";
import {
  getAllClasses,
  createClass,
  getClassAutocomplete,
} from "../controllers/class.controller.js";

const classRouter = Router();

classRouter.get("/autocomplete", getClassAutocomplete);
classRouter.get("/", getAllClasses);
classRouter.get("/:id", (req, res) => res.send({ title: "class" }));
classRouter.post("/", createClass);
classRouter.delete("/:id", (req, res) => res.send({ title: "class" }));
classRouter.put("/:id", (req, res) => res.send({ title: "class" }));

export default classRouter;
