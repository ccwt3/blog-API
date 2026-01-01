import userController from "../controllers/userController";
import checkToken from "../services/chekToken";
import { Router } from "express";
const usersRouter = Router();
export default usersRouter;


usersRouter.get("/", userController.getUsers);

usersRouter.get("/me", checkToken, (req: any, res: any) => {
  res.status(200).json({message: `hello ${req.user.username}`})
})
