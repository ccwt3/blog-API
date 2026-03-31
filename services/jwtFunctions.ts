import "dotenv/config";
import jwt from "jsonwebtoken";
import tokensModel from "../models/tokensModel";
import UsersModel from "../models/UsersModel";

export default {
  jwtSignAccess,
  jwtVerifyAccess,
  jwtSignRefresh,
  jwtVerifyRefresh,
  createNewToken,
};

interface payload {
  id: string;
  role: string;
  username: string;
}

const accesSecret = process.env.JWT_KEY;
const refreshSecret = process.env.JWT_KEY_REFRESH;

if (!accesSecret || !refreshSecret) {
  throw new Error("Key is empty");
}

async function createNewToken(userId: string) {
  const userObj = await UsersModel.getUser(userId);

  if (userObj.status === 404) {
    return { status: userObj.status, message: "User not found" };
  } else if (userObj.status === 500) {
    return { status: userObj.status, message: "Error fetching user" };
  }

  const accesToken = jwtSignAccess({
    id: userObj.user!.id,
    role: userObj.user!.role,
    username: userObj.user!.username,
  });

  return { status: 200, token: accesToken };
}

async function jwtSignRefresh(payload: payload) {
  const token = jwt.sign({ userId: payload.id }, refreshSecret!, {
    expiresIn: "1h",
  });

  const storer = await tokensModel.storeToken(token, payload.id);

  if (storer.status === 500) {
    return { status: 500 };
  }

  return token;
}

function jwtSignAccess(payload: payload) {
  try {
    const token = jwt.sign(payload, accesSecret!, { expiresIn: "3m" });
    return token;
  } catch (error) {
    console.error("Error signing access token:", error);
    return { status: 500, message: "Error signing access token" };
  }
}

async function jwtVerifyRefresh(token: string) {
  try {
    const payload = jwt.verify(token, refreshSecret!);

    if (typeof payload === "string") {
      return { status: 401, message: "Invalid token" };
    }

    const result = await tokensModel.deleteToken(token, payload.userId);

    if (result.status === 403) return { status: 403, message: "Reused token" };
    else if (result.status === 500)
      return { status: 500, message: "Error deleting token" };

    return { status: 200, id: payload.userId };
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return { status: 500, message: "Invalid token" };
  }
}

function jwtVerifyAccess(token: string) {
  try {
    const payload = jwt.verify(token, accesSecret!);
    return { status: 200, payload };
  } catch (error) {
    console.error("Error verifying access token:", error);
    return { status: 401, message: "Invalid token" };
  }
}
