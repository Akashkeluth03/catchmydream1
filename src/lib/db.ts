import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error(
    [
      "Missing env var DATABASE_URL.",
      "Create a .env file in the project root (see .env.example).",
      'Example: DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/study_in_asia?schema=public"',
    ].join("\n")
  );
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

