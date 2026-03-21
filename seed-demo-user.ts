import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const name = "demo user";
  const email = "demo@example.com";
  const password = "pass@123";
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: "MEMBER",
    },
    create: {
      name,
      email,
      passwordHash,
      role: "MEMBER",
    },
  });

  console.log(`User ${user.email} created/updated successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
