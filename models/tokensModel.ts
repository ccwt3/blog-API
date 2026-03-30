import { prisma } from "../prisma/lib/prisma";
import { createHash } from "node:crypto";

export default {
  storeToken,
  deleteToken,
};

async function storeToken(token: string, userId: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");

  try {
    const row = await prisma.tokens.create({
      data: {
        user_id: userId,
        token: hashedToken,
      },
    });

    return { status: 200, row: row.id };
  } catch {
    return { status: 500 };
  }
}

async function deleteToken(token: string, userId: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");

  try {
    const deleted = await prisma.tokens
      .delete({
        where: { token: hashedToken },
      })
      .catch(() => null);

    if (!deleted) {
      await prisma.tokens.deleteMany({ where: { user_id: userId } });
      return { status: 401 };
    }

    return { status: 200 };
  } catch {
    return { status: 500 };
  }
}
