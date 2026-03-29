import authController from "../controllers/authController";
import { Router } from "express";
const authRouter: Router = Router();
export default authRouter;

authRouter.post("/login", authController.authLogin);
authRouter.post("/register", authController.authRegister);
authRouter.post("/refresh", authController.authRefresh);