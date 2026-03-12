//yOU CAN DELET THE FILE
import { Router } from "express";
import { logout, signin, signup } from "../controllers/auth.controller.js";

export const authRouter = Router();

authRouter.post("/auth/signup", signup)
authRouter.post("/auth/signin", signin)
authRouter.post("/auth/logout", logout)
