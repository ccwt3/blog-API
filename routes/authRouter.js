import authController from "../controllers/authController"
import { Router } from "express";
const authRouter = Router();
export default authRouter;

authRouter.post("/login", authController.authLogin);
authRouter.post("/register", authController.authRegister)
