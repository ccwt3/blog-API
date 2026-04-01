import { prisma } from "../prisma/lib/prisma";
import { createHash } from "node:crypto";

export default {
  storeToken,
  deleteToken,
};

async function storeToken(token: string, userId: string) {
  try {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const row = await prisma.tokens.create({
      data: {
        user_id: userId,
        token: hashedToken,
      },
    });

    return { status: 200, row: row.id };
  } catch (error) {
    console.error("Error storing token:", error);
    return { status: 500 };
  }
}

async function deleteToken(token: string, userId: string) {
  try {
    const hashedToken = createHash("sha256").update(token).digest("hex");
    const deleted = await prisma.tokens.delete({
      where: { token: hashedToken },
    });

    return { status: 200 };
  } catch (error: any) {
    if (error?.code === "P2025") {
      await prisma.tokens.deleteMany({ where: { user_id: userId } });
      return { status: 403 };
    }

    console.error("Error deleting token:", error);
    return { status: 500 };
  }
}
