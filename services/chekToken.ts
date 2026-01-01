import jwtFC from "./jwtFunctions"

export default function checkToken(req: any, res: any, next: any) {
  const headerBearer = req.headers["authorization"];
  if (!headerBearer) {
    return res.status(400).json({ message: "No given token" });
  }

  const bearer = headerBearer.split(" ");
  const token = bearer[1];
  
  const userInfo = jwtFC.jwtVerify(token);
  if (userInfo === 401) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = userInfo
  next()
}