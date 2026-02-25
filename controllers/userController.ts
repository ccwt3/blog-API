import type { Request, Response } from "express";

export default {
  getUsers,
};

async function getUsers(req: Request, res: Response) {
  return res.status(200).json({ message: "get users" });
}
