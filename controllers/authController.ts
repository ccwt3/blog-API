import jwtFC from "../services/jwtFunctions";
import userModel from "../models/UsersModel";

export default {
  authLogin,
  authRegister,
};

async function authLogin(req: any, res: any) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(401).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.validateCredentials(username, password);
  if (userObj.status === 401) {
    return res.status(401).json({ message: userObj.message });
  }

  const userToken = jwtFC.jwtSign({
    id: userObj.id,
    role: userObj.role,
    username: userObj.username,
  });
  return res.status(200).json({ token: userToken });
}

async function authRegister(req: any, res: any) {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(401).json({ message: "No given credentials" });
  }

  const username = req.body.username;
  const password = req.body.password;

  const userObj = await userModel.createUser(username, password);

  if (userObj.status === 409) {
    return res.status(409).json({ message: userObj.message });
  }

  const userToken = jwtFC.jwtSign({
    id: userObj.id,
    role: userObj.role,
    username: userObj.username,
  });
  return res.status(200).json({ token: userToken });
}
