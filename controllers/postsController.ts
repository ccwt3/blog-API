import type { Response, Request } from "express";

export default {
  getPosts,
};

async function getPosts(req: Request, res: Response) {
  return res.status(200).json({ message: "get posts" });
}
