import authController from "../controllers/authController"
import { Router } from "express";
const authRouter = Router();
export default authRouter;

authRouter.get("/", authController.getAuth);
