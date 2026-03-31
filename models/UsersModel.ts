import { prisma } from "../prisma/lib/prisma";
import bcrypt from "bcryptjs";

export default {
  createUser,
  validateCredentials,
  getUser,
};

async function getUser(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { status: 404 };
    }

    return { status: 200, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { status: 500 };
  }
}

async function createUser(userName: string, password: string) {
  try {
    const isUsernameUsed = await prisma.user.findUnique({
      where: {
        username: userName,
      },
    });

    if (isUsernameUsed) {
      return { status: 409 };
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        username: userName,
        password: hashedPassword,
      },
    });

    return {
      status: 200,
      id: user.id,
      role: user.role,
      username: user.username,
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return { status: 500 };
  }
}

async function validateCredentials(username: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return { status: 401 };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { status: 401 };
    }

    return {
      status: 200,
      id: user.id,
      role: user.role,
      username: user.username,
    };
  } catch (error) {
    console.error("Error validating credentials:", error);
    return { status: 500 };
  }
}
