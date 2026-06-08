const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const slugs = [
    "indian-institute-of-technology-bombay",
    "university-of-delhi",
    "indian-institute-of-science",
    "tsinghua-university",
    "peking-university",
    "fudan-university"
  ];
  for (const slug of slugs) {
    await prisma.university.deleteMany({
      where: { slug }
    });
  }
  console.log("Deleted extra universities.");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
