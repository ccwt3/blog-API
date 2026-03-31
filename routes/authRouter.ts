import authController from "../controllers/authController";
import { Router } from "express";
import sanitizerCheck from "../services/sanitizerCheck";
import authValidatorChain from "../services/validation/authValidatorChain";

const authRouter: Router = Router();
export default authRouter;

authRouter.post(
  "/login",
  authValidatorChain,
  sanitizerCheck,
  authController.authLogin,
);
authRouter.post(
  "/register",
  authValidatorChain,
  sanitizerCheck,
  authController.authRegister,
);

authRouter.post("/refresh", authController.authRefresh);
authRouter.post("/logout", authController.authLogout);
