import { Router } from "express";
import {
  createSchedule,
  deleteSchedule,
  getAllSchedules,
} from "../controllers/schedule.controller.js";

const scheduleRouter = Router();

scheduleRouter.get("/", getAllSchedules);
scheduleRouter.get("/:id", (req, res) => res.send({ title: "schedule" }));
scheduleRouter.post("/", createSchedule);
scheduleRouter.delete("/:id", deleteSchedule);
scheduleRouter.put("/:id", (req, res) => res.send({ title: "schedule" }));

export default scheduleRouter;
