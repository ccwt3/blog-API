import { prisma } from "../prisma/lib/prisma";
import { createHash } from "node:crypto";

export default {
  storeToken,
  reviewToken,
};

async function storeToken(token: string, userId: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");

  const row = await prisma.tokens.create({
    data: {
      user_id: userId,
      token: hashedToken,
    },
  });

  return row ? { status: 200, row: row.id } : { status: 500 };
}

async function reviewToken(token: string, userId: string) {
  const hashedToken = createHash("sha256").update(token).digest("hex");
  
  const deleted = await prisma.tokens.delete({
    where: { token: hashedToken },
  }).catch(() => null);

  if (!deleted) {
    await prisma.tokens.deleteMany({ where: { user_id: userId } });
    return { status: 401 };
  }

  return { status: 200 };
}