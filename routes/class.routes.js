import { Router } from "express";

const classRouter = Router();

classRouter.get("/", (req, res) => res.send({ title: "class" }));
classRouter.get("/:id", (req, res) => res.send({ title: "class" }));
classRouter.post("/", (req, res) => res.send({ title: "class" }));
classRouter.delete("/:id", (req, res) => res.send({ title: "class" }));
classRouter.put("/:id", (req, res) => res.send({ title: "class" }));

export default classRouter;
