import { Router } from "express";

import postController from "../controllers/postsController";
import checkToken from "../services/chekToken";

const postsRouter: Router = Router();
export default postsRouter;

postsRouter.post("/", checkToken, postController.postNewPost);

postsRouter.get("/", checkToken, postController.emptyEndpoint);
postsRouter.get("/:id", checkToken, postController.getPost);
