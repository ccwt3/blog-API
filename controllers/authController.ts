import jwtFC from "../services/jwtFunctions";
import userModel from "../models/UsersModel";

import type { Request, Response } from "express";

export default {
  authLogin,
  authRegister,
  authRefresh,
  authLogout,
};

const cookieNormalizer = (
  res: Response,
  access: string,
  refresh: string,
  message: string,
) => {
  return res
    .status(200)
    .cookie("token", access, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 1,
      path: "/",
    })
    .cookie("refreshToken", refresh, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/refresh",
    })
    .cookie("refreshToken", refresh, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/logout",
    })
    .json({ message: message });
};

async function authLogin(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.loginUser(username, password);

  switch (userObj.status) {
    case 401:
      return res.status(401).json({ message: "Invalid Credentials" });

    case 500:
      return res.status(500).json({ message: "Error validating credentials" });
    default:
      break;
  }

  const userToken = jwtFC.jwtSignAccess({
    id: userObj.id!,
    role: userObj.role!,
    username: userObj.username!,
  });

  const refreshToken = await jwtFC.jwtSignRefresh({
    id: userObj.id!,
  });

  if (userToken.status === 500 || refreshToken.status === 500) {
    return { status: 500, message: "error signing tokens" };
  }

  return cookieNormalizer(
    res,
    userToken.token!,
    refreshToken.token!,
    "userLoged",
  );
}

async function authRegister(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.registerUser(username, password);

  if (userObj.status === 409) {
    return res.status(409).json({ message: "Username is already in use" });
  } else if (userObj.status === 500) {
    return res.status(500).json({ message: "Error creating user" });
  }

  const userToken = jwtFC.jwtSignAccess({
    id: userObj.id!,
    role: userObj.role!,
    username: userObj.username!,
  });

  const refreshToken = await jwtFC.jwtSignRefresh({
    id: userObj.id!,
  });

  if (userToken.status === 500 || refreshToken.status === 500) {
    return { status: 500, message: "error signing tokens" };
  }

  return cookieNormalizer(
    res,
    userToken.token!,
    refreshToken.token!,
    "Register succesful",
  );
}

async function authRefresh(req: Request, res: Response) {
  if (!req.signedCookies || !req.signedCookies.refreshToken) {
    return res.status(400).json({ message: "No given credentials" });
  }
  const refreshToken = req.signedCookies.refreshToken;

  const newRefresh = await jwtFC.rotateRefreshToken(refreshToken);
  
  if (newRefresh.status !== 200) {
    res
      .clearCookie("token", { path: "/" })
      .clearCookie("refreshToken", { path: "/auth/refresh" })
      .clearCookie("refreshToken", { path: "/auth/logout" });

      console.log(newRefresh);
      return res.status(newRefresh.status).json({message: newRefresh.message})
  }

  const newAccess = await jwtFC.createAccessToken(newRefresh.token!);

  if (newAccess.status !== 200) {
    return res.status(newAccess.status).json({ message: newAccess.message});
  }

  return cookieNormalizer(res, newAccess.token!, newRefresh.token!, "Tokens Refreshed succesfully")
}

async function authLogout(req: Request, res: Response) {
  if (!req.signedCookies || !req.signedCookies.refreshToken) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const refreshToken = req.signedCookies.refreshToken;
  const result = await jwtFC.jwtLogout(refreshToken);

  res
    .clearCookie("token", { path: "/" })
    .clearCookie("refreshToken", { path: "/auth/refresh" })
    .clearCookie("refreshToken", { path: "/auth/logout" });


  return res.status(result.status).json({message: result.message})
}
