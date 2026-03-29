import { prisma } from "../prisma/lib/prisma";
import bcrypt from "bcryptjs";

export default {
  createUser,
  validateCredentials,
  getUser,
};

async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return { status: 404, message: "User not found" };
  }

  return { status: 200, user };
}

async function createUser(userName: string, password: string) {
  const isUsernameUsed = await prisma.user.findUnique({
    where: {
      username: userName,
    },
  });

  if (isUsernameUsed) {
    return { status: 409, message: "Username is already in use" };
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      username: userName,
      password: hashedPassword,
    },
  });

  return { status: 200, id: user.id, role: user.role, username: user.username };
}

async function validateCredentials(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) {
    return { status: 401, message: "Invalid Credentials" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { status: 401, message: "Invalid Credentials" };
  }

  return { status: 200, id: user.id, role: user.role, username: user.username };
}
