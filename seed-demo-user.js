const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

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
      role: "ADMIN", // Elevate to Admin if needed for testing everything
    },
    create: {
      name,
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`User ${user.email} created/updated successfully with role ADMIN.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
