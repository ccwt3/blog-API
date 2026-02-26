import userController from "../controllers/userController";
import checkToken from "../services/chekToken";

import { Router, type Request, type Response } from "express";

const usersRouter: Router = Router();
export default usersRouter;

interface UsersRequest extends Request {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

usersRouter.get("/", userController.getUsers);

usersRouter.get("/me", checkToken, (req: UsersRequest, res: Response) => {
  console.log(req.user?.username)

  res.status(200).json({ message: `hello ${req.user?.username}` });
});
