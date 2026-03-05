import userController from "../controllers/userController";
import checkToken from "../services/chekToken";

import { Router } from "express";

const usersRouter: Router = Router();
export default usersRouter;

usersRouter.get("/me", checkToken, userController.getMe);
usersRouter.get("/me/posts", checkToken, userController.getMyPosts);
