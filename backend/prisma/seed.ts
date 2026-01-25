import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add seeding logic here if needed
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
