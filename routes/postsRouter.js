import postController from "../controllers/postsController"
import { Router } from "express";
const postsRouter = Router();
export default postsRouter;

postsRouter.get("/", postController.getPosts);
