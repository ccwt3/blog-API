import "dotenv/config";
import jwt from "jsonwebtoken";
import tokensModel from "../models/tokensModel";
import UsersModel from "../models/UsersModel";
import type { JwtPayload } from "jsonwebtoken";

export default {
  jwtVerifyAccess,
  jwtSignAccess,
  jwtSignRefresh,

  createAccessToken,
  rotateRefreshToken,
  jwtLogout,
};

interface payload {
  id: string;
  role: string;
  username: string;
}

interface IdPayload {
  id: string;
}

type JwtResult = {
  status: number;
  message: string;
  token?: string | undefined;
  payload?: string | JwtPayload;
};

const accesSecret = process.env.JWT_KEY;
const refreshSecret = process.env.JWT_KEY_REFRESH;

if (!accesSecret || !refreshSecret) {
  throw new Error("Key is empty");
}

async function jwtSignRefresh(payload: IdPayload) {
  try {
    const token = jwt.sign({ userId: payload.id }, refreshSecret!, {
      expiresIn: "1h",
    });

    const storer = await tokensModel.storeToken(token, payload.id);

    if (storer.status === 500) {
      return { status: 500 };
    }

    return { status: 200, token, message: "" };
  } catch (error) {
    console.error("Error signing token: ", error);
    return { status: 500 };
  }
}

function jwtSignAccess(payload: payload) {
  try {
    const token = jwt.sign(payload, accesSecret!, { expiresIn: "1m" });
    return { status: 200, token, message: "" };
  } catch (error) {
    console.error("Error signing access token:", error);
    return { status: 500, message: "Error signing access token" };
  }
}

function jwtVerifyAccess(token: string) {
  try {
    const payload = jwt.verify(token, accesSecret!);

    return { status: 200, payload, message: "" };
  } catch (error) {
    console.error("Error verifying access token:", error);
    return { status: 401, message: "Invalid token" };
  }
}

function jwtVerifyRefresh(token: string) {
  try {
    const payload = jwt.verify(token, refreshSecret!);

    return { status: 200, payload, message: "" };
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return { status: 401, message: "Invalid token" };
  }
}

//* ---------------------------------------------------------------

async function jwtLogout(token: string) {
  const userData = jwtVerifyRefresh(token);

  if (userData.status === 401) return userData;
  if (typeof userData.payload === "string")
    return { status: 401, message: "invalid token" };

  const result = await tokensModel.deleteToken(token, userData.payload!.userId);

  switch (result.status) {
    case 403:
      return { status: result.status, message: "Reused token" };

    case 500:
      return { status: result.status, message: "Error loging out" };

    default:
      break;
  }

  return { status: result.status, message: "User logged out succesfully" };
}

async function createAccessToken(token: string): Promise<JwtResult> {
  const userData = jwtVerifyRefresh(token);

  if (userData.status === 401) return userData;
  if (typeof userData.payload === "string")
    return { status: 401, message: "Invalid Token" };

  console.log(userData)
  const userObj = await UsersModel.getUser(userData.payload!.userId);

  switch (userObj.status) {
    case 404:
      return { status: userObj.status, message: "User not found" };

    case 500:
      return { status: userObj.status, message: "Error fetching user" };

    default:
      break;
  }

  const accesToken = jwtSignAccess({
    id: userObj.user!.id,
    role: userObj.user!.role,
    username: userObj.user!.username,
  });

  if (accesToken.status === 500) return accesToken;

  return { status: 200, token: accesToken.token, message: "" };
}

async function rotateRefreshToken(token: string) {
  try {
    const payload = jwt.verify(token, refreshSecret!);
    if (typeof payload === "string")
      return { status: 401, message: "Invalid Token" };

    const result = await tokensModel.deleteToken(token, payload.userId);

    switch (result.status) {
      case 403:
        return { status: 403, message: "Reused Token" };

      case 500:
        return { status: 500, message: "Error Deleting the token" };

      default:
        break;
    }

    const newRefreshToken = await jwtSignRefresh({ id: payload.userId });

    if (newRefreshToken.status === 500)
      return { status: 500, message: "Error storing the new token" };

    return { status: 200, token: newRefreshToken.token, message: "" };
  } catch (error) {
    console.error("Error rotating the token:", error);
    return { status: 500, message: "Error rotating the token" };
  }
}
