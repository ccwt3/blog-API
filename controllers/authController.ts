import jwtFC from "../services/jwtFunctions";
import userModel from "../models/UsersModel";

import type { Request, Response } from "express";

export default {
  authLogin,
  authRegister,
  authRefresh,
  authLogout,
};

async function authLogin(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.validateCredentials(username, password);
  if (userObj.status === 401) {
    return res.status(401).json({ message: "Invalid Credentials" });
  } else if (userObj.status === 500) {
    return res.status(500).json({ message: "Error validating credentials" });
  }

  const userToken = jwtFC.jwtSignAccess({
    id: userObj.id!,
    role: userObj.role!,
    username: userObj.username!,
  });

  const refreshToken = await jwtFC.jwtSignRefresh({
    id: userObj.id!,
    role: userObj.role!,
    username: userObj.username!,
  });

  return res
    .status(200)
    .cookie("token", userToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 3,
      path: "/",
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/refresh",
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/logout",
    })
    .json({ message: "User loged" });
}

async function authRegister(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.createUser(username, password);

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
    role: userObj.role!,
    username: userObj.username!,
  });

  return res
    .status(201)
    .cookie("token", userToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 3,
      path: "/",
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/refresh",
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
      path: "/auth/logout",
    })
    .json({ message: "User created" });
}

async function authRefresh(req: Request, res: Response) {
  if (!req.signedCookies || !req.signedCookies.refreshToken) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const refreshToken = req.signedCookies.refreshToken;
  const userData = await jwtFC.jwtVerifyRefresh(refreshToken);

  if (userData.status === 401) {
    return res.status(401).json({ message: userData.message });
  } else if (userData.status === 500) {
    return res.status(500).json({ message: userData.message });
  }

  const newToken = await jwtFC.createNewToken(userData.id);

  if (newToken.status !== 200) {
    return res.status(401).json({ message: newToken.message });
  }

  return res
    .status(200)
    .cookie("token", newToken.token!, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 3,
      path: "/",
    })
    .json({ message: "Token refreshed" });
}

async function authLogout(req: Request, res: Response) {
  if (!req.signedCookies || !req.signedCookies.refreshToken) {
    return res.status(400).json({ message: "No given credentials" });
  }

  const refreshToken = req.signedCookies.refreshToken;
  const userData = await jwtFC.jwtVerifyRefresh(refreshToken);

  if (userData.status === 401) {
    return res.status(401).json({ message: userData.message });
  } else if (userData.status === 403) {
    return res.status(403).json({ message: userData.message });
  } else if (userData.status === 500) {
    return res.status(500).json({ message: userData.message });
  }

  return res
    .status(200)
    .clearCookie("token", { path: "/" })
    .clearCookie("refreshToken", { path: "/auth/refresh" })
    .clearCookie("refreshToken", { path: "/auth/logout" })
    .json({ message: "User loged out" });
}
