import { Router } from "express";
import { authorizedUser, signIn } from "../controllers/auth.controller.js";
import { authorized } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.get("/authorized", authorized, authorizedUser);
authRouter.post("/sign-in", signIn);

export default authRouter;
