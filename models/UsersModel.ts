import { prisma } from "../prisma/lib/prisma";
import bcrypt from "bcryptjs";

class User {
  constructor() {}

  async getUser(userId: string) {
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

  async registerUser(username: string, password: string) {
    try {
      const isUsernameUsed = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });

      if (isUsernameUsed) {
        return { status: 409 };
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          username: username,
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

  async loginUser(username: string, password: string) {
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
}

const userModel = new User();

export default userModel;
