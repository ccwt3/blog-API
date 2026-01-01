import "dotenv/config";
import jwt from "jsonwebtoken";
export default {
  jwtSign,
  jwtVerify,
}

const secret = process.env.JWT_KEY;
if (!secret) {
  throw new Error("Key is empty");
}

function jwtSign(payload: object) {
  const token = jwt.sign(payload, secret!);
  return token;
}

function jwtVerify(token: string) {
  try {
    const payload = jwt.verify(token, secret!);
    return payload;
  } catch(err) {
    return 401
  }
}