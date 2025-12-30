import userController from "../controllers/userController";
import { Router } from "express";
const usersRouter = Router();
export default usersRouter;


usersRouter.get("/", userController.getUsers);
usersRouter.get("/me", (req, res) => {
  res.status(200).json({message: "hola omar"})
})
