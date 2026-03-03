import type { Request, Response } from "express";

interface UsersRequest extends Request {
  user?: {
    id: string;
    role: string;
    username: string;
  };
}

export default {
  getMe,
};

async function getMe(req: UsersRequest, res: Response) {
  return res.status(200).json(req.user?.username);
}
