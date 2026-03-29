import jwtFC from "../services/jwtFunctions";
import userModel from "../models/UsersModel";

import type { Request, Response } from "express";

export default {
  authLogin,
  authRegister,
};

async function authLogin(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(401).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.validateCredentials(username, password);
  if (userObj.status === 401) {
    return res.status(401).json({ message: userObj.message });
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
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    })
    .json({ message: "User loged" });
}

async function authRegister(req: Request, res: Response) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(401).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.createUser(username, password);

  if (userObj.status === 409) {
    return res.status(409).json({ message: userObj.message });
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
    })
    .cookie("refreshToken", refreshToken, {
      signed: true,
      httpOnly: true,
      secure: process.env.ENVIRONMENT === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    })
    .json({ message: "User created" });
}
