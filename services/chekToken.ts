import type { Response, Request, NextFunction } from "express";
import jwtFC from "./jwtFunctions";

export default function checkToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const tokenCookie = req.signedCookies.token;

  if (!tokenCookie) {
    return res.status(400).json({ message: "No given token" });
  }

  const userInfo = jwtFC.jwtVerifyAccess(tokenCookie);

  if (userInfo === 401) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = userInfo as { id: string; role: string; username: string };
  next();
}
