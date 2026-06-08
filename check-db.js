const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const countryCount = await prisma.country.count();
  const universityCount = await prisma.university.count();
  console.log(`Countries in DB: ${countryCount}`);
  console.log(`Universities in DB: ${universityCount}`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
