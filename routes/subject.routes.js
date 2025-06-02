import { Router } from "express";
import {
  createSubject,
  deleteSubject,
  getAllSubjects,
  getSubject,
  getSubjectsAutocomplete,
  updateSubject,
} from "../controllers/subject.controller.js";

const subjectRoute = Router();

subjectRoute.get("/autocomplete", getSubjectsAutocomplete);
subjectRoute.get("/", getAllSubjects);
subjectRoute.get("/:id", getSubject);
subjectRoute.post("/", createSubject);
subjectRoute.delete("/:id", deleteSubject);
subjectRoute.put("/:id", updateSubject);

export default subjectRoute;
