import { Router } from "express";

import postController from "../controllers/postsController";
import checkToken from "../services/chekToken";
import { checkTokenForAnon } from "../services/chekToken";

import postValidatorChain from "../services/validation/postValidatorChain";
import postUpdateValidatorChain from "../services/validation/postUpdateValidatorChain";
import sanitizerCheck from "../services/sanitizerCheck";

const postsRouter: Router = Router();
export default postsRouter;

postsRouter.get("/", checkToken, postController.emptyEndpoint);
postsRouter.get("/:id", checkTokenForAnon, postController.getPost);

postsRouter.post(
  "/",
  postValidatorChain,
  sanitizerCheck,
  checkToken,
  postController.postNewPost,
);

postsRouter.patch(
  "/:id",
  postUpdateValidatorChain,
  sanitizerCheck,
  checkToken,
  postController.updatePost,
);

postsRouter.delete("/:id", checkToken, postController.deletePost);
